import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { className, value, max = 100, showLabel = false, size = 'md', ...props },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    }

    return (
      <div
        ref={ref}
        className={cn('w-full bg-bg-lighter rounded-full overflow-hidden', className)}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className={cn(
            'bg-primary transition-all duration-300 ease-out',
            sizeClasses[size]
          )}
          style={{ width: `${percentage}%` }}
        />

        {showLabel && (
          <span className="text-xs text-muted ml-2">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
