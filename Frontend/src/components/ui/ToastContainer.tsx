import { useToast } from "../hooks/use-toast";

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4 sm:top-4 sm:justify-end">
      <div className="flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border bg-white px-4 py-3 text-sm shadow-lg transition-all duration-200 ${
              toast.open === false
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            } ${
              toast.variant === "destructive"
                ? "border-red-200 bg-red-50 text-red-900"
                : "border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex-1">
              {toast.title && (
                <div className="font-semibold leading-snug">{toast.title}</div>
              )}
              {toast.description && (
                <div className="mt-1 text-xs text-slate-700">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="ml-2 text-slate-400 transition hover:text-slate-600"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

