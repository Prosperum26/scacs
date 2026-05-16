import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { users } from '../data/mockData'

function Users() {
  return (
    <Card title="User Directory" subtitle="Fake campus identities and credential status">
      <Table
        headers={['ID', 'Name', 'Role', 'Department', 'Status']}
        rows={users.map((user) => [user.id, user.name, user.role, user.department, <StatusBadge value={user.status} />])}
      />
    </Card>
  )
}

export default Users
