import Link from 'next/link'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: { label: string; href: string }
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{emoji}</span>
      <h3 className="text-base font-bold text-swiggy-black">{title}</h3>
      <p className="text-sm text-swiggy-gray mt-1 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <Link href={action.href} className="mt-5 btn-primary text-sm inline-block">
          {action.label}
        </Link>
      )}
    </div>
  )
}
