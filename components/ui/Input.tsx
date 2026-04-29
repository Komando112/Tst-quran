import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'ghost'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default:
        'border border-border-color bg-background focus-visible:ring-primary',
      ghost: 'border-0 bg-bg-lighter focus-visible:ring-0 focus-visible:bg-border-color',
    }

    return (
      <input
        ref={ref}
        className={cn(
          'rounded-lg px-3 py-2 text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
