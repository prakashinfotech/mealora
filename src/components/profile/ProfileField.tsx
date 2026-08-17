interface ProfileFieldProps {
  label: string
  value: string | null | undefined
  placeholder?: string
  mono?: boolean
}

export function ProfileField({ label, value, placeholder = 'Not added', mono = false }: ProfileFieldProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-app-border last:border-0 gap-6">
      <p className="text-sm text-app-gray shrink-0 w-28">{label}</p>
      <p className={`text-sm text-right flex-1 min-w-0 truncate ${
        value
          ? `font-medium text-app-black ${mono ? 'font-mono tracking-wide' : ''}`
          : 'text-app-gray-light italic'
      }`}>
        {value || placeholder}
      </p>
    </div>
  )
}
