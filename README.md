# TinyPNG browser image compressor

Private, client-side image compression with React, TypeScript, Canvas, and JSZip. Select or drop multiple PNG, JPEG, and WebP images, adjust quality and dimensions, and download individual results or a ZIP. No image data is uploaded.

## Run

```sh
npm install
npm run dev
```

On Windows with restricted PowerShell scripts, use `npm.cmd` instead of `npm`.

## Verify and build

```sh
npm run build
npm run lint
npm test
```

The browser tests use installed Microsoft Edge and start Vite automatically. On non-Windows systems, change the webServer command in `playwright.config.ts` to `npm run dev -- --host 127.0.0.1`. To use Playwright's bundled Chromium instead, remove `channel: 'msedge'` and run `npx playwright install chromium`.

Deploy the generated `dist` directory to any static web host. No backend or API keys are needed.

## Deploy to GitHub Pages

The workflow in [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs on pushes to `main` and can also be started manually. It uses Node.js 24, installs locked dependencies with `npm ci`, runs lint and the existing TypeScript/Vite production build, uploads `dist`, and deploys it in a separate job. A failed lint or build prevents deployment.

## Styling

Use Tailwind's default utilities, colors, spacing, typography, and responsive breakpoints in the components. No custom theme tokens or arbitrary design values are needed. `src/index.css` contains only the Tailwind import and shared base/accessibility rules; `src/components/Panda.css` preserves the existing CSS illustration.

## Behavior and limits

- Quality is an encoder setting, not a target file-size percentage. Actual savings appear after processing.
- Canvas PNG encoding is lossless and ignores quality. Resize PNGs or convert to WebP for greater reduction.
- Same-format, original-dimension exports retain the original file when encoding does not reduce its size. Explicit format changes and resizing are honored even if the output is larger.
- PNG/WebP preserve transparency; JPEG composites onto white. Animated inputs become still images when re-encoded. Metadata may be removed.
- Files are limited to 50 MB each. Output dimensions are limited to 40 megapixels and 16,384 pixels per side. Large batches depend on available browser memory.
- Images process sequentially, settings changes discard stale results, and preview URLs are released when removed. ZIP filenames are deduplicated.
- Browser tests cover real JPEG/PNG/WebP decoding and encoding, transparency, drag-and-drop, invalid files, resizing, ZIP contents, individual downloads, reset, and mobile overflow.

Inspired by the supplied TinyPNG UI references and [freeCodeCamp's Canvas compression walkthrough](https://www.freecodecamp.org/news/how-to-build-a-bulk-image-compressor-tool-with-html-css-and-javascript/). See [Canvas toBlob documentation](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) for encoder behavior.
