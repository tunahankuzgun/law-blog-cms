import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  let title = 'Bilgiç Hukuk Bürosu'
  let description =
    'Bilgiç Hukuk Bürosu - İş hukuku, ticaret hukuku, gayrimenkul hukuku ve aile hukuku alanlarında uzman avukatlarımızla hizmetinizdeyiz.'

  // Use doc.meta.title and description exactly as is if they exist
  if (doc?.meta?.title) {
    title = `${doc.meta.title}`
  } else {
    title = 'Bilgiç Hukuk Bürosu | Profesyonel Hukuki Danışmanlık'
  }

  if (doc?.meta?.description) {
    description = doc.meta.description
  } else {
    description =
      'Bilgiç Hukuk Bürosu - İş hukuku, ticaret hukuku, gayrimenkul hukuku ve aile hukuku alanlarında uzman avukatlarımızla hizmetinizdeyiz.'
  }

  const keywords = [
    'hukuk bürosu',
    'avukat',
    'hukuki danışmanlık',
    doc?.meta?.title?.toLowerCase() || '',
    'türk hukuku',
    'istanbul avukat',
  ].filter(Boolean)

  const openGraphMetadata = {
    ...(doc && 'isWorkArea' in doc
      ? {
          type: 'article',
          article: {
            publishedTime: doc.publishedAt as string,
            modifiedTime: doc.updatedAt as string,
            section: 'Hukuk',
            authors: ['Bilgiç Hukuk Bürosu'],
          },
        }
      : { type: 'website' }),
    description,
    images: ogImage
      ? [
          {
            url: ogImage,
            alt: doc?.meta?.title || 'Bilgiç Hukuk Bürosu',
          },
        ]
      : undefined,
    title,
    url: doc?.slug ? (Array.isArray(doc.slug) ? doc.slug.join('/') : '/') : '/',
  }

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: mergeOpenGraph(openGraphMetadata),
  }
}
