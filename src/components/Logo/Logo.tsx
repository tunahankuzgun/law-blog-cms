import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import BilgicLogo from '../../../public/bilgic-hukuk.png'
import { TransitionLink } from '@/components/PageTransition'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  linkClassName?: string
  href?: string
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    linkClassName,
    href,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const logoImage = (
    <Image
      alt="Bilgiç Hukuk Logo"
      width={1024}
      height={600}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={BilgicLogo}
    />
  )

  // If href is provided, wrap the logo in a TransitionLink
  if (href) {
    return (
      <TransitionLink href={href} className={clsx('inline-block', linkClassName)}>
        {logoImage}
      </TransitionLink>
    )
  }

  // Otherwise, just return the logo image
  return logoImage
}
