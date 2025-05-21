import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Bilgiç Hukuk Bürosu - İş hukuku, ticaret hukuku, gayrimenkul hukuku ve aile hukuku alanlarında uzman avukatlarımızla hizmetinizdeyiz. Profesyonel hukuki danışmanlık için bize ulaşın.',
  images: [
    {
      url: `${getServerSideURL()}/calisma-alanlari-og.webp`,
      alt: 'Bilgiç Hukuk Bürosu Logo',
    },
  ],
  siteName: 'Bilgiç Hukuk Bürosu',
  title: 'Bilgiç Hukuk Bürosu | Profesyonel Hukuk ve Danışmanlık Hizmetleri',
  locale: 'tr_TR',
  countryName: 'Türkiye',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
