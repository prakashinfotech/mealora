import { cn } from '@/lib/utils'
import { AdminEmpty } from './AdminEmpty'

export interface AdminColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  /** Raw accessor used when render is not provided */
  accessor?: keyof T
  className?: string
  headerClassName?: string
}

interface Props<T extends { id: string }> {
  columns: AdminColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  onRowClick?: (row: T) => void
  className?: string
}

function SkeletonRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <div className="h-4 rounded bg-slate-100 skeleton-shimmer" style={{ width: `${60 + ((r + c) * 13) % 35}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found',
  emptyDescription,
  onRowClick,
  className,
}: Props<T>) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <SkeletonRows cols={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <AdminEmpty message={emptyMessage} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-slate-50',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-4 py-3.5 text-slate-700 whitespace-nowrap', col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor != null
                          ? String(row[col.accessor] ?? '—')
                          : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
