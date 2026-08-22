function ThreeDButton({
  front = "FRONT",
  back = "BACK",
  duration = 500,
  frontColor = "#323237",
  backColor = "#adadaf",
  textColor = "#adadaf",
  backTextColor = "#323237",
  className = "",
}) {
  return (
    <button
      className={`velmora-3d-button ${className}`}
      style={{
        "--3d-duration": `${duration}ms`,
        "--3d-front-bg": frontColor,
        "--3d-back-bg": backColor,
        "--3d-front-text": textColor,
        "--3d-back-text": backTextColor,
      }}
    >
      <span className="velmora-3d-button__body">

        <span className="velmora-3d-button__face velmora-3d-button__front">
          {front}
        </span>

        <span className="velmora-3d-button__face velmora-3d-button__top">
          {back}
        </span>

      </span>
    </button>
  );
}

export default ThreeDButton;