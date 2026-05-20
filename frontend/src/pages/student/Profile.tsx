import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="animate-slide-up mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-6 glass rounded-2xl p-8 text-center">
        <img src={user.avatarUrl} alt="" className="mx-auto size-24 rounded-full border-4 border-cyan-400/40" />
        <h2 className="mt-4 text-xl font-bold">{user.fullName}</h2>
        <p className="text-cyan-300">{user.studentId}</p>
        <dl className="mt-6 space-y-3 text-left text-sm">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-slate-400">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-slate-400">Department</dt>
            <dd>{user.department}</dd>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-slate-400">Status</dt>
            <dd className={user.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}>{user.status}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Access level</dt>
            <dd>{user.accessLevel}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
