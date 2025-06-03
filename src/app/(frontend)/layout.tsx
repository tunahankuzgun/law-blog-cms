import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="tr" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* TODO */}
        <script
          id="law-firm-schema"
          type="application/ld+json"
          src="/"
          async
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LegalService',
              name: 'Bilgiç Hukuk Bürosu',
              alternateName: 'Bilgic Law Firm',
              image: `${getServerSideURL()}/calisma-alanlari-og.webp`,
              '@id': getServerSideURL(),
              url: getServerSideURL(),
              telephone: '+90XXXXXXXXXX', // Add your phone number
              address: {
                '@type': 'PostalAddress',
                streetAddress: '', // Add your street address
                addressLocality: 'Istanbul',
                addressRegion: 'Istanbul',
                postalCode: '', // Add your postal code
                addressCountry: 'TR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 0, // Add your latitude
                longitude: 0, // Add your longitude
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
              },
              sameAs: [
                'https://www.facebook.com/bilgichukuk', // Add your social media URLs
                'https://twitter.com/bilgichukuk',
                'https://www.linkedin.com/company/bilgic-hukuk',
              ],
              serviceArea: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: 41.0082, // Istanbul coordinates
                  longitude: 28.9784,
                },
                geoRadius: '50000',
              },
              areaServed: {
                '@type': 'Country',
                name: 'Türkiye',
                identifier: 'TR',
              },
              description:
                'Bilgiç Hukuk Bürosu - İş hukuku, ticaret hukuku, gayrimenkul hukuku ve aile hukuku alanlarında uzman avukatlarımızla hizmetinizdeyiz.',
              priceRange: '₺₺',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Hukuki Hizmetler',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'İş Hukuku Danışmanlığı',
                      description:
                        'İşçi-işveren ilişkileri, iş sözleşmeleri, işe iade davaları ve tazminat talepleri konularında hukuki danışmanlık',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Ticaret Hukuku Danışmanlığı',
                      description:
                        'Şirket kuruluşları, birleşme ve devralmalar, ticari sözleşmeler ve uyuşmazlık çözümü',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Gayrimenkul Hukuku',
                      description:
                        'Taşınmaz alım-satımı, kira hukuku, kat mülkiyeti ve imar hukuku danışmanlığı',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Aile Hukuku',
                      description:
                        'Boşanma, nafaka, velayet ve miras hukuku konularında danışmanlık',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'İcra ve İflas Hukuku',
                      description:
                        'Alacak takibi, icra takibi ve iflas işlemleri konularında hukuki destek',
                    },
                  },
                ],
              },
              knowsLanguage: [
                {
                  '@type': 'Language',
                  name: 'Turkish',
                  alternateName: 'tr',
                },
                {
                  '@type': 'Language',
                  name: 'English',
                  alternateName: 'en',
                },
              ],
              memberOf: [
                {
                  '@type': 'Organization',
                  name: 'İstanbul Barosu',
                  url: 'https://www.istanbulbarosu.org.tr',
                },
              ],
              awards: ['İstanbul Barosu Kayıtlı Üye'],
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header />
          {children}
          <Footer />
          <WhatsAppButton
            phoneNumber="+900000000000"
            message="Merhaba, hukuki danışmanlık almak istiyorum."
          />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
