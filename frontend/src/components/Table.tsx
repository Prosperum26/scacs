import type { ReactNode } from 'react'

type TableProps = {
  headers: string[]
  rows: ReactNode[][]
}

function Table({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-600 first:rounded-l-lg last:rounded-r-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border-b border-slate-100 px-4 py-4 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
