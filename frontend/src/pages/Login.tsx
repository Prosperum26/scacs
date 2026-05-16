type LoginProps = {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <span className="size-2 rounded-full bg-emerald-400"></span>
            Final demo environment online
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white lg:text-6xl">
            SCACS Smart Campus Access Control System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Monitor gates, verify identities, and review access activity from a focused security operations dashboard.
          </p>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {['Live Gate Status', 'QR Verification', 'Audit Logs'].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Security Console</p>
          <h2 className="mt-3 text-3xl font-bold">Operator Login</h2>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Operator ID</span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                defaultValue="admin.nguyen"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                defaultValue="demo-access"
                type="password"
              />
            </label>
            <button
              type="button"
              onClick={onLogin}
              className="w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Enter Dashboard
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
