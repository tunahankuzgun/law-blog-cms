import type { Metadata } from 'next/types'
import type { Media } from '@/payload-types'
import PageClient from './page.client'
import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { generateMeta } from '@/utilities/generateMeta'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      isWorkArea: {
        equals: true,
      },
    },
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      isWorkArea: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Çalışma Alanları</h1>
        </div>
      </div>
      <CollectionArchive posts={posts.docs} isServices />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const metaImage: Media = {
    id: 1,
    url: '/calisma-alanlari-og.webp',
    alt: 'Bilgiç Hukuk Bürosu Çalışma Alanları',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    width: 1200,
    height: 630,
    mimeType: 'image/webp',
  }

  return generateMeta({
    doc: {
      meta: {
        title: 'Çalışma Alanları | Bilgiç Hukuk Bürosu',
        description: 'Bilgiç Hukuk Bürosu hukuki hizmet alanları ve uzmanlık konuları.',
        image: metaImage,
      },
    },
  })
}
