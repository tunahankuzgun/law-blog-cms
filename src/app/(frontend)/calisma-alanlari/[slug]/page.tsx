import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import PageClient from '../page.client'
import { PostHero } from '@/heros/PostHero'
import RichText from '@/components/RichText'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/calisma-alanlari/' + slug
  const post = await queryPostBySlug({ slug })
  const allServices = await queryAllServices()
  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {/* {draft && <LivePreviewListener />}  */}
      <PostHero isWorkArea={true} post={post} />
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container relative">
          <div className="flex">
            <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          </div>
        </div>
      </div>
      <div className="container"></div>
    </article>
  )
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryAllServices = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      isWorkArea: {
        equals: true,
      },
    },
    limit: 100,
    select: {
      title: true,
      slug: true,
    },
  })

  return result.docs || []
})
