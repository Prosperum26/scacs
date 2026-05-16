import { useDemo } from '../context/demoContext'

function ToastContainer() {
  const { removeToast, toasts } = useDemo()

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          className={`animate-slide-in rounded-lg border p-4 text-left shadow-xl backdrop-blur transition hover:-translate-y-0.5 ${
            toast.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
              : toast.tone === 'error'
                ? 'border-rose-200 bg-rose-50/95 text-rose-900'
                : 'border-cyan-200 bg-cyan-50/95 text-cyan-900'
          }`}
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm opacity-80">{toast.message}</p>
        </button>
      ))}
    </div>
  )
}

export default ToastContainer
