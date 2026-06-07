import { useEffect } from "react";

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

function Toast({ feedback, onClose }) {
  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onClose, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [feedback?.id]);

  if (!feedback) {
    return null;
  }

  const classes = toneClasses[feedback.type] || toneClasses.info;

  return (
    <div
      role={feedback.type === "error" ? "alert" : "status"}
      className={`fixed bottom-4 left-4 right-4 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg sm:left-auto sm:max-w-sm ${classes}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p>{feedback.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg px-2 text-base leading-none opacity-70 transition hover:opacity-100"
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
