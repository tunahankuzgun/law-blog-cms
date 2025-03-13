'use client'
import clsx from 'clsx'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import BilgicLogo from '../../../public/bilgic-hukuk.png'
import BilgicLogoDark from '../../../public/bilgic-hukuk-black.png'
import { TransitionLink } from '@/components/PageTransition'
import { useTheme } from '@payloadcms/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  linkClassName?: string
  href?: string
  theme?: string
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    linkClassName,
    href,
    theme: headerTheme,
  } = props

  const { theme: globalTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)

  // Determine the effective theme based on both headerTheme and globalTheme
  useEffect(() => {
    // If headerTheme is explicitly set, use it
    if (headerTheme) {
      setCurrentTheme(headerTheme)
    } else {
      // Otherwise fall back to global theme
      setCurrentTheme(globalTheme)
    }
  }, [headerTheme, globalTheme])

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
      src={currentTheme === 'dark' ? BilgicLogo : BilgicLogoDark}
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
