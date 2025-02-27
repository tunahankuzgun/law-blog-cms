'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts' | 'calisma-alanlari'
  showCategories?: boolean
  title?: string
  isServiceCard?: boolean
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps, isServiceCard } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        isServiceCard
          ? 'flex items-center p-6 border border-border rounded-lg bg-card hover:cursor-pointer hover:bg-accent/10 transition-colors'
          : 'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {isServiceCard ? (
        <>
          <div className="flex-1">
            {titleToUse && (
              <h3 className="text-xl font-semibold mb-2">
                <Link href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              </h3>
            )}
            {description && <p className="text-muted-foreground">{sanitizedDescription}</p>}
          </div>
          <div className="ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full">
            {!metaImage && <div className="">No image</div>}
            {metaImage && typeof metaImage !== 'string' && (
              <Media resource={metaImage} size="33vw" />
            )}
          </div>
          <div className="p-4">
            {showCategories && hasCategories && (
              <div className="uppercase text-sm mb-4">
                {showCategories && hasCategories && (
                  <div>
                    {categories?.map((category, index) => {
                      if (typeof category === 'object') {
                        const { title: titleFromCategory } = category

                        const categoryTitle = titleFromCategory || 'Untitled category'

                        const isLast = index === categories.length - 1

                        return (
                          <Fragment key={index}>
                            {categoryTitle}
                            {!isLast && <Fragment>, &nbsp;</Fragment>}
                          </Fragment>
                        )
                      }

                      return null
                    })}
                  </div>
                )}
              </div>
            )}
            {titleToUse && (
              <div className="prose">
                <h3>
                  <Link className="not-prose" href={href} ref={link.ref}>
                    {titleToUse}
                  </Link>
                </h3>
              </div>
            )}
            {description && (
              <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>
            )}
          </div>
        </>
      )}
    </article>
  )
}
