import { useEffect, useState } from 'react'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { apiClient } from '../services/apiClient'
import type { CreateUserPayload, User } from '../types/api'

const initialForm: CreateUserPayload = {
  id: '',
  name: '',
  role: 'student',
  department: '',
  status: 'active',
}

const formatText = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<CreateUserPayload>(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const refreshUsers = async () => {
    try {
      setIsLoading(true)
      setError('')
      setUsers(await apiClient.getUsers())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        setError('')
        setUsers(await apiClient.getUsers())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const createUser = async () => {
    try {
      setIsSaving(true)
      setError('')
      await apiClient.createUser(form)
      setForm(initialForm)
      await refreshUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setError('')
      await apiClient.deleteUser(id)
      await refreshUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Create User" subtitle="Add a campus identity through the backend API">
        <div className="grid gap-3 pt-2 md:grid-cols-5">
          <input
            value={form.id}
            onChange={(event) => setForm({ ...form, id: event.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="ID"
          />
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Name"
          />
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value as CreateUserPayload['role'] })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
          </select>
          <input
            value={form.department}
            onChange={(event) => setForm({ ...form, department: event.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Department"
          />
          <button
            type="button"
            onClick={createUser}
            disabled={isSaving}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {isSaving ? 'Creating...' : 'Create'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-rose-700">{error}</p>}
      </Card>
      <Card title="User Directory" subtitle="Campus identities and credential status">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading users...</p>
        ) : (
          <Table
            headers={['ID', 'Name', 'Role', 'Department', 'Status', 'Action']}
            rows={users.map((user) => [
              user.id,
              user.name,
              formatText(user.role),
              user.department,
              <StatusBadge value={formatText(user.status)} />,
              <button
                type="button"
                onClick={() => deleteUser(user.id)}
                className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete
              </button>,
            ])}
          />
        )}
      </Card>
    </div>
  )
}

export default Users
