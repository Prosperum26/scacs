import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="animate-slide-up mx-auto max-w-lg">
      <h1 className="text-xl font-bold sm:text-2xl">Profile</h1>
      <div className="mt-6 glass rounded-2xl p-6 text-center sm:p-8">
        <img src={user.avatarUrl} alt="" className="mx-auto size-20 rounded-full border-4 border-cyan-400/40 sm:size-24" />
        <h2 className="mt-4 text-lg font-bold sm:text-xl">{user.fullName}</h2>
        <p className="text-cyan-300">{user.studentId}</p>
        <dl className="mt-6 space-y-3 text-left text-sm">
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3 sm:flex-row sm:justify-between sm:gap-0 sm:pb-2">
            <dt className="shrink-0 text-slate-400">Email</dt>
            <dd className="break-all sm:text-right">{user.email}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3 sm:flex-row sm:justify-between sm:pb-2">
            <dt className="text-slate-400">Department</dt>
            <dd className="text-right sm:max-w-[60%] sm:truncate">{user.department}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3 sm:flex-row sm:justify-between sm:pb-2">
            <dt className="text-slate-400">Status</dt>
            <dd className={`text-right ${user.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {user.status}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className="text-slate-400">Access level</dt>
            <dd className="text-right">{user.accessLevel}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
