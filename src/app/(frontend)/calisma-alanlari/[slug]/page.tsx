import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import PageClient from '../page.client'
import { PostHero } from '@/heros/PostHero'
import RichText from '@/components/RichText'
import { getServerSideURL } from '@/utilities/getURL'
import Script from 'next/script'
import { generateMeta } from '@/utilities/generateMeta'

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
  const { slug = '' } = await paramsPromise
  const url = '/calisma-alanlari/' + slug

  const post = await queryPostBySlug({ slug })

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta?.description,
    image:
      post.meta?.image && typeof post.meta.image === 'object' && 'url' in post.meta.image
        ? `${getServerSideURL()}${post.meta.image.url}`
        : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Bilgiç Hukuk Bürosu',
      url: getServerSideURL(),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bilgiç Hukuk Bürosu',
      logo: {
        '@type': 'ImageObject',
        url: `${getServerSideURL()}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${getServerSideURL()}${url}`,
    },
  }

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}
