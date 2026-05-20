import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="student-bg flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">SCACS</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl">Smart Campus Access Control System</h1>
      <p className="mt-4 max-w-lg text-slate-400">
        QR-based secure campus entry for students and real-time security monitoring for admin staff.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/student/login"
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-8 py-4 font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90"
        >
          Student Portal
        </Link>
        <Link
          to="/admin/login"
          className="rounded-xl border border-emerald-500/40 bg-slate-950/80 px-8 py-4 font-semibold text-emerald-400 hover:bg-emerald-500/10"
        >
          Admin / Security
        </Link>
      </div>
    </div>
  )
}
