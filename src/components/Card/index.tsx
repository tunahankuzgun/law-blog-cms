'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { ImageMedia } from '../Media/ImageMedia'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'makaleler' | 'calisma-alanlari'
  showCategories?: boolean
  title?: string
  isServiceCard?: boolean
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps, isServiceCard } = props

  if (!doc) return null

  const { slug, categories, meta, title } = doc
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={
        isServiceCard
          ? 'rounded-lg overflow-hidden hover:cursor-pointer'
          : cn(
              'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
              className,
            )
      }
      ref={card.ref}
    >
      {isServiceCard ? (
        <Link href={`/${relationTo}/${doc.slug}`} className="group flex flex-col h-full">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {metaImage && typeof metaImage !== 'string' && (
              <ImageMedia
                resource={metaImage}
                imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
          <div className="flex flex-col p-6">
            <h3 className="text-xl text-center font-semibold text-gray-900 dark:text-white mb-4">
              {doc.title}
            </h3>
            <div className="flex mt-auto items-center justify-center">
              <button className="inline-flex  px-4 py-2 text-sm font-medium text-white bg-[#5C4B3C] hover:bg-[#4A3C30] rounded-md transition-colors">
                Detaylar
              </button>
            </div>
          </div>
        </Link>
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
