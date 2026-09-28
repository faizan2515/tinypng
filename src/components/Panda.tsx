import "./Panda.css";

export default function Panda({ small = false }: { small?: boolean }) {
  return (
    <div className={`panda ${small ? "small" : ""}`} aria-hidden="true">
      <i className="ear left" />
      <i className="ear right" />
      <div className="panda-face">
        <i className="eye left" />
        <i className="eye right" />
        <i className="nose" />
        <i className="mouth" />
        <i className="cheek left" />
        <i className="cheek right" />
      </div>
      {!small && (
        <>
          <div className="panda-body" />
          <i className="paw left" />
          <i className="paw right" />
          <div className="bamboo">🌿</div>
        </>
      )}
    </div>
  );
}
