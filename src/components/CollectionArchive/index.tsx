import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  relationTo?: 'makaleler' | 'calisma-alanlari'
  isServices?: boolean
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, relationTo = 'makaleler', isServices } = props

  return (
    <div className={cn('container py-8')}>
      <div>
        <div
          className={cn(
            isServices
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8',
          )}
        >
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              if (isServices) {
                return (
                  <Card
                    key={index}
                    doc={result}
                    relationTo={relationTo}
                    isServiceCard
                    className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  />
                )
              }
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo={relationTo} showCategories />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
