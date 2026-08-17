interface ProfileAddress {
  id: string
  label: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

const LABEL_META: Record<string, { icon: string; chip: string }> = {
  Home:  { icon: '🏠', chip: 'bg-brand-primary-light text-brand-primary' },
  Work:  { icon: '💼', chip: 'bg-blue-50 text-blue-600' },
  Other: { icon: '📍', chip: 'bg-app-gray-bg text-app-gray' },
}

interface AddressCardProps {
  address: ProfileAddress
}

export function AddressCard({ address }: AddressCardProps) {
  const meta = LABEL_META[address.label] ?? LABEL_META.Other
  const lines = [address.line1, address.line2, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="bg-white rounded-2xl border border-app-border p-5 hover:border-brand-primary/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${meta.chip}`}>
          {meta.icon} {address.label}
        </span>
        {address.isDefault && (
          <span className="inline-flex items-center text-xs font-semibold text-app-green bg-green-50 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>
      <p className="text-sm text-app-gray leading-relaxed">{lines}</p>
    </div>
  )
}
