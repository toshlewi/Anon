import { useEffect } from "react";
import { FiCheck } from "react-icons/fi";

export default function SuccessToast({ open, onClose, title = "Sent!", message = "Your message was delivered anonymously." }) {
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="success-pop w-full max-w-sm rounded-2xl border border-rose/20 bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <FiCheck className="h-7 w-7" strokeWidth={3} />
        </div>
        <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-inkLight">{message}</p>
        <button type="button" onClick={onClose} className="btn-primary mt-5 w-full">
          Got it
        </button>
      </div>
    </div>
  );
}
