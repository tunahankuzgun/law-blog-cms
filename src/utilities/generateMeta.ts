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

  // Add specific suffixes based on content type
  if (doc?.meta?.title) {
    if ('isWorkArea' in doc && doc.isWorkArea) {
      title = `${doc.meta.title} | Çalışma Alanları | Bilgiç Hukuk Bürosu`
      description = `${doc.meta.description || `${doc.meta.title} alanında uzman avukatlarımızla hukuki danışmanlık ve dava takibi hizmetleri sunuyoruz.`}`
    } else if ('layout' in doc) {
      title = `${doc.meta.title} | Bilgiç Hukuk Bürosu`
      description = doc.meta.description || description
    } else {
      title = `${doc.meta.title} | Hukuki Makaleler | Bilgiç Hukuk Bürosu`
      description =
        doc.meta.description ||
        `${doc.meta.title} konusunda detaylı hukuki bilgi ve güncel içerikler.`
    }
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
