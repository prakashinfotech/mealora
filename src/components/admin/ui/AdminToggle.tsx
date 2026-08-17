'use client'

interface Props {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
}

export function AdminToggle({ label, checked, onChange, description }: Props) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-slate-200'}`} />
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </label>
  )
}
