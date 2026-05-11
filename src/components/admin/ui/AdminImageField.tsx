'use client'

import { useState } from 'react'
import { AdminFormField, AdminInput } from './AdminFormField'

interface Props {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  description?: string
  placeholder?: string
}

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'

export function AdminImageField({ label, id, value, onChange, error, description, placeholder }: Props) {
  const [previewError, setPreviewError] = useState(false)
  const showPreview = value && value.startsWith('http') && !previewError

  return (
    <AdminFormField label={label} htmlFor={id} description={description} error={error}>
      <AdminInput
        id={id}
        type="url"
        value={value}
        onChange={(e) => { onChange(e.target.value); setPreviewError(false) }}
        placeholder={placeholder ?? 'https://images.unsplash.com/…'}
      />
      {/* Preview */}
      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={PLACEHOLDER_IMG}
            alt="Placeholder"
            className="w-full h-full object-cover opacity-30"
          />
        )}
      </div>
      {previewError && (
        <p className="text-xs text-amber-600 mt-1">Could not load image — check the URL.</p>
      )}
    </AdminFormField>
  )
}
