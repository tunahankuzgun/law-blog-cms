import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

type Props = {
  services: { title: string; slug?: string | null }[]
  currentSlug: string
}

export const ServicesSidebar = ({ services, currentSlug }: Props) => {
  return (
    <div className="border-r border-border pr-6">
      <nav className="flex flex-col space-y-2">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/calisma-alanlari/${service.slug}`}
            className={cn(
              'p-3 rounded-lg transition-colors',
              'hover:bg-accent/10',
              currentSlug === service.slug
                ? 'bg-accent/10 font-medium text-accent-foreground'
                : 'text-muted-foreground',
            )}
          >
            {service.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
