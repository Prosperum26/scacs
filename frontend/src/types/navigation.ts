export type Page = 'Dashboard' | 'Scanner' | 'Users' | 'Logs' | 'Reports'

export type NavItem = {
  label: Page
  path: string
}
