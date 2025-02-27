import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  relationTo?: 'posts' | 'calisma-alanlari'
  isServices?: boolean
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, relationTo = 'posts', isServices } = props

  return (
    <div className={cn('container')}>
      <div>
        <div
          className={cn(
            isServices
              ? 'flex flex-col space-y-4'
              : 'grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8',
          )}
        >
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return isServices ? (
                <Card key={index} doc={result} relationTo={relationTo} isServiceCard />
              ) : (
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
