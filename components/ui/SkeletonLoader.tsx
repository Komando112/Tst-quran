import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  circle?: boolean
  inline?: boolean
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, count = 1, circle = false, inline = false, ...props }, ref) => {
    const items = Array.from({ length: count }, (_, i) => i)

    return (
      <>
        {items.map((i) => (
          <div
            key={i}
            ref={ref}
            className={cn(
              'animate-pulse bg-bg-lighter rounded',
              circle && 'rounded-full',
              inline && 'inline-block mr-2',
              !inline && 'mb-3',
              className
            )}
            {...props}
          />
        ))}
      </>
    )
  }
)

Skeleton.displayName = 'Skeleton'

export function SkeletonCard() {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-border-color animate-pulse">
      <div className="h-6 bg-bg-lighter rounded w-1/3" />
      <div className="space-y-3">
        <div className="h-4 bg-bg-lighter rounded" />
        <div className="h-4 bg-bg-lighter rounded w-5/6" />
      </div>
    </div>
  )
}

export function SkeletonAyah() {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-border-color">
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-bg-lighter rounded w-4/5" />
        <div className="h-8 bg-bg-lighter rounded w-full" />
        <div className="h-8 bg-bg-lighter rounded w-3/5" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-bg-lighter rounded w-24 animate-pulse" />
        <div className="h-10 bg-bg-lighter rounded flex-1 animate-pulse" />
      </div>
    </div>
  )
}
