import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import KuzgunLogo from '../../../public/kuzgun.svg'
interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <Image
      alt="Kuzgun Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] border-2 w-full h-[34px]', className)}
      src={KuzgunLogo}
    />
  )
}
