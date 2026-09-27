import { test, expect, type Page } from "@playwright/test";
import JSZip from "jszip";
import { readFile } from "node:fs/promises";

async function fixture(page: Page, type = "image/png", name = "sample.png") {
  const data = await page.evaluate((type) => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    const pixels = ctx.createImageData(480, 320);
    let seed = 42;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      pixels.data[i] = seed % 256;
      pixels.data[i + 1] = (seed >>> 8) % 256;
      pixels.data[i + 2] = (seed >>> 16) % 256;
      pixels.data[i + 3] = i < 480 * 4 ? 0 : 255;
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas.toDataURL(type, 1).split(",")[1];
  }, type);
  return { name, mimeType: type, buffer: Buffer.from(data, "base64") };
}

test("multi-file compression, actual ZIP entries, resizing, reset and individual downloads", async ({
  page,
}) => {
  await page.goto("/");
  const file = await fixture(page);
  await page.locator("input[type=file]").setInputFiles([file, file]);
  await page.getByLabel("Output format").selectOption("image/webp");
  await page.getByLabel("Image dimensions").selectOption("50");
  await expect(page.getByText("2 of 2 images ready")).toBeVisible();
  await expect(page.locator(".dimensions").first()).toHaveText("240 × 160");
  const zipped = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download all/ }).click();
  const zipDownload = await zipped;
  expect(zipDownload.suggestedFilename()).toBe("tiny-images.zip");
  const zip = await JSZip.loadAsync(
    await readFile((await zipDownload.path())!),
  );
  expect(Object.keys(zip.files)).toEqual([
    "sample-tiny.webp",
    "sample-tiny-2.webp",
  ]);
  const compressed = await zip.files["sample-tiny.webp"].async("nodebuffer");
  expect(compressed.length).toBeLessThan(file.buffer.length);
  expect(compressed.toString("ascii", 8, 12)).toBe("WEBP");
  await page.getByRole("button", { name: "Reset defaults" }).click();
  await expect(page.getByText("2 of 2 images ready")).toBeVisible();
  await page.getByRole("button", { name: "Reset defaults" }).click();
  await expect(page.getByText("2 of 2 images ready")).toBeVisible();
  const single = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download sample.png", exact: true })
    .first()
    .click();
  expect((await single).suggestedFilename()).toMatch(/\.png$/);
  await page.getByRole("button", { name: /Clear all/ }).click();
  await expect(
    page.getByText("Your lighter images will appear here.", { exact: false }),
  ).toBeVisible();
});

test("drag and drop JPEG, quality adjustment, validation and failed decode", async ({
  page,
}) => {
  await page.goto("/");
  const file = await fixture(page, "image/jpeg", "photo.jpeg");
  await page.evaluate(
    ({ data, name, type }) => {
      const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      const transfer = new DataTransfer();
      transfer.items.add(new File([bytes], name, { type }));
      document
        .querySelector(".dropzone")!
        .dispatchEvent(
          new DragEvent("drop", { bubbles: true, dataTransfer: transfer }),
        );
    },
    {
      data: file.buffer.toString("base64"),
      name: file.name,
      type: file.mimeType,
    },
  );
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
  await page.getByLabel("Image quality").fill("20");
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
  const result = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download image", exact: true })
    .click();
  const downloaded = await readFile((await (await result).path())!);
  expect(downloaded.length).toBeLessThan(file.buffer.length);
  expect(downloaded[0]).toBe(255);
  expect(downloaded[1]).toBe(216);
  await page.locator("input[type=file]").setInputFiles([
    { name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("test") },
    {
      name: "broken.png",
      mimeType: "image/png",
      buffer: Buffer.from("broken"),
    },
  ]);
  await expect(page.getByRole("alert")).toContainText("use PNG, JPEG, or WebP");
  await expect(
    page.getByText("This image could not be decoded. Try another file."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download image", exact: true }),
  ).toBeEnabled();
});

test("transparent PNG stays transparent, JPEG uses white, WebP input is supported", async ({
  page,
}) => {
  await page.goto("/");
  const file = await fixture(page);
  await page.locator("input[type=file]").setInputFiles(file);
  await page.getByLabel("Image dimensions").selectOption("50");
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
  async function pixel() {
    const promise = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download image", exact: true })
      .click();
    const buffer = await readFile((await (await promise).path())!);
    return page.evaluate(async (data) => {
      const bitmap = await createImageBitmap(
        new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))]),
      );
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      return [...ctx.getImageData(0, 0, 1, 1).data];
    }, buffer.toString("base64"));
  }
  // Keep full dimensions to examine the fully transparent first row.
  await page.getByLabel("Image dimensions").selectOption("100");
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
  expect((await pixel())[3]).toBe(0);
  await page.getByLabel("Output format").selectOption("image/jpeg");
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
  const rgba = await pixel();
  expect(rgba[3]).toBe(255);
  expect(rgba[0]).toBeGreaterThan(200);
  await page.getByRole("button", { name: /Clear all/ }).click();
  await page
    .locator("input[type=file]")
    .setInputFiles(await fixture(page, "image/webp", "photo.webp"));
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
});

test("desktop and mobile layout have no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  await page.locator("input[type=file]").setInputFiles(await fixture(page));
  await expect(page.getByText("1 of 1 images ready")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
