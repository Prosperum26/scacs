import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="student-bg flex min-h-[100dvh] flex-col items-center justify-center gap-6 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-white">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">SCACS</p>
      <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        Smart Campus Access Control System
      </h1>
      <p className="max-w-lg text-sm text-slate-400 sm:text-base">
        QR-based secure campus entry for students and real-time security monitoring for admin staff.
      </p>
      <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
        <Link
          to="/student/login"
          className="tap-target w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-4 text-center text-base font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90 sm:w-auto sm:min-w-[12rem]"
        >
          Student Portal
        </Link>
        <Link
          to="/admin/login"
          className="tap-target w-full rounded-xl border border-emerald-500/40 bg-slate-950/80 px-6 py-4 text-center text-base font-semibold text-emerald-400 hover:bg-emerald-500/10 sm:w-auto sm:min-w-[12rem]"
        >
          Admin / Security
        </Link>
      </div>
    </div>
  )
}
