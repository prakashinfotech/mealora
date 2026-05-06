import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-swiggy-black mb-1.5">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-swiggy-gray-light">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'input-base',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-swiggy-red focus:ring-swiggy-red/30 focus:border-swiggy-red',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-swiggy-gray-light">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-swiggy-red">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
