import { useEffect, useRef, useState } from "react";
import "../../styles/buttons/uploadButton.css";

function UploadButton({
  filename = "Document.pdf",
  buttonText = "Upload",
  uploadingText = "Uploading...",
  completedText = "Completed",

  uploadDuration = 3000,
  completeDuration = 2000,

  buttonColor = "#3bafda",
  progressColor = "#2d334c",

  className = "",
}) {
  const [status, setStatus] = useState("idle");
  const timers = useRef([]);

  function handleUpload() {
    if (status !== "idle") return;

    setStatus("uploading");

    const uploadTimer = setTimeout(() => {
      setStatus("uploaded");

      const completeTimer = setTimeout(() => {
        setStatus("uploaded-after");

        const resetTimer = setTimeout(() => {
          setStatus("idle");
        }, 1000);

        timers.current.push(resetTimer);
      }, completeDuration);

      timers.current.push(completeTimer);
    }, uploadDuration);

    timers.current.push(uploadTimer);
  }

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={`velmora-upload velmora-upload--${status} ${className}`}
      style={{
        "--upload-button-color": buttonColor,
        "--upload-progress-color": progressColor,
      }}
    >
      {/*
        __stage is the clipping/positioning context for the final
        "conveyor" move. __main and __progress are siblings inside it
        so a single transform on __stage moves both together.
      */}
      <div className="velmora-upload__stage">
        <div className="velmora-upload__main">
          <div className="velmora-upload__info">
            <svg
              className="velmora-upload__clip"
              viewBox="0 0 1024 1024"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M645.516 141.211c21.362 0 41.795 4.049 61.403 12.063a159.716 159.716 0 0 1 54.264 35.873c15.845 16.077 27.77 34.137 35.784 54.135 7.861 19.306 11.766 39.803 11.766 61.536 0 21.684-3.905 42.22-11.766 61.541-8.014 19.993-19.958 38.028-35.784 54.086L459.787 722.528c-9.21 9.22-20.151 16.483-32.743 21.773-12.29 4.81-24.541 7.193-36.822 7.193-12.29 0-24.561-2.383-36.856-7.193-12.636-5.29-23.533-12.557-32.738-21.773-9.552-9.581-16.69-20.447-21.506-32.58-4.785-11.618-7.158-23.913-7.158-36.925 0-13.141 2.373-25.555 7.164-37.193 4.81-11.949 11.949-22.786 21.5-32.55l278.116-278.462c6.452-6.511 14.223-9.754 23.276-9.754 8.869 0 16.547 3.243 23.033 9.754 6.476 6.491 9.739 14.184 9.739 23.083 0 9.052-3.263 16.819-9.739 23.32L366.975 629.738c-6.328 6.293-9.487 14.08-9.487 23.305 0 9.067 3.154 16.76 9.487 23.088 6.803 6.506 14.56 9.759 23.266 9.759 8.672 0 16.433-3.253 23.276-9.764l301.377-302.049c18.94-18.965 28.407-42.047 28.407-69.258 0-27.162-9.467-50.264-28.407-69.229-19.444-19.133-42.557-28.724-69.313-28.724-26.974 0-49.992 9.591-69.1 28.724L274.337 536.892a159.998 159.998 0 0 0-35.808 54.333c-8.034 19.652-12.043 40.282-12.043 61.798 0 21.209 4.005 41.81 12.043 61.798 8.172 20.344 20.102 38.369 35.808 54.086 16.226 16.063 34.305 28.13 54.234 36.159 19.914 8.034 40.47 12.068 61.65 12.068 21.139 0 41.701-4.034 61.63-12.068 19.919-8.024 38.018-20.097 54.224-36.154l300.868-301.535c6.476-6.501 14.238-9.769 23.281-9.769 8.889 0 16.562 3.263 23.048 9.769 6.486 6.486 9.725 14.179 9.725 23.068 0 9.097-3.239 16.854-9.725 23.375L552.404 815.354c-22 22.02-47.327 38.883-75.987 50.492-27.315 11.297-56.039 16.942-86.201 16.942-30.019 0-58.743-5.646-86.206-16.942-28.684-11.609-54.007-28.472-76.007-50.492a226.196 226.196 0 0 1-50.131-75.903 226.863 226.863 0 0 1-16.903-86.403c0-30.083 5.621-58.881 16.908-86.384 11.405-28.378 28.116-53.759 50.131-76.16h.247L530.142 189.201c15.692-15.731 33.687-27.7 53.987-35.897 19.968-8.044 40.425-12.073 61.382-12.073Z" />
            </svg>

            <span className="velmora-upload__filename">{filename}</span>
          </div>

          <button
            type="button"
            className="velmora-upload__button"
            onClick={handleUpload}
            disabled={status !== "idle"}
          >
            <div className="velmora-upload__button-text">{buttonText}</div>
          </button>

          <div className="velmora-upload__hint">{uploadingText}</div>
        </div>

        <div className="velmora-upload__progress">
          <svg
            className="velmora-upload__check"
            width="16"
            height="16"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 13 11"
          >
            <polyline points="1 5.5 5 9.5 12 1.5" />
          </svg>

          <span className="velmora-upload__completed-text">
            {completedText}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UploadButton;