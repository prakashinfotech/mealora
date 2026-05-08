interface ProfileFieldProps {
  label: string
  value: string | null | undefined
  placeholder?: string
  mono?: boolean
}

export function ProfileField({ label, value, placeholder = 'Not added', mono = false }: ProfileFieldProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-swiggy-border last:border-0 gap-6">
      <p className="text-sm text-swiggy-gray shrink-0 w-28">{label}</p>
      <p className={`text-sm text-right flex-1 min-w-0 truncate ${
        value
          ? `font-medium text-swiggy-black ${mono ? 'font-mono tracking-wide' : ''}`
          : 'text-swiggy-gray-light italic'
      }`}>
        {value || placeholder}
      </p>
    </div>
  )
}
