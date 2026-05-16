import type { ReactNode } from 'react'

type OutletProps = {
  children: ReactNode
}

function Outlet({ children }: OutletProps) {
  return <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
}

export default Outlet
