import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Memoization cache
const contentCache = new Map<string, string>()

// Optimized helper function to extract text content from Lexical rich text
const extractTextFromLexical = (content: SerializedEditorState | undefined): string => {
  if (!content || !content.root) return ''

  // Create a cache key from the content
  const cacheKey = JSON.stringify(content)

  // Check if we have cached this content before
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!
  }

  // Extract text (existing logic)
  let text = ''
  const extractFromNode = (node: any) => {
    // If it's a text node, add its text content
    if (node.type === 'text' && node.text) {
      text += node.text + ' '
    }

    // If it has children, process them recursively
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(extractFromNode)
    }

    // If it's a block with fields that might contain text
    if (node.fields) {
      // Handle block content if it exists
      if (node.fields.content && node.fields.content.root) {
        extractFromNode(node.fields.content.root)
      }

      // Handle text fields directly
      if (node.fields.text) {
        text += node.fields.text + ' '
      }
    }
  }

  // Start extraction from the root
  extractFromNode(content.root)

  // Cache the result
  contentCache.set(cacheKey, text.trim())

  return text.trim()
}

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export const revalidate = 3600 // Revalidate once per hour

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // If there's no query, just get posts with default criteria
  if (!query) {
    const posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 6,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        isWorkArea: true,
      },
      pagination: false,
    })

    return (
      <div className="pt-24 pb-24">
        <PageClient />
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none text-center">
            <h1 className="mb-8 lg:mb-16">Arama</h1>

            <div className="max-w-[50rem] mx-auto">
              <Search />
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="container">Arama sonuçları yükleniyor...</div>}>
          {posts.totalDocs > 0 ? (
            <CollectionArchive posts={posts.docs as CardPostData[]} />
          ) : (
            <div className="container">Arama sonucu bulunamadı.</div>
          )}
        </Suspense>
      </div>
    )
  }

  // Fetch both result sets concurrently
  const [dbFilteredPosts, contentSearchPosts] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 20,
      where: {
        or: [
          { title: { contains: query } },
          { slug: { contains: query } },
          { 'meta.title': { contains: query } },
          { 'meta.description': { contains: query } },
          // We'll handle content search separately
        ],
      },
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        isWorkArea: true,
      },
      pagination: false,
    }),

    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 100,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        content: true,
        isWorkArea: true,
      },
      pagination: false,
    }),
  ])

  // Content and category search
  const contentFilteredPosts = contentSearchPosts.docs.filter((post) => {
    // Content search
    let contentMatch = false
    if (post.content) {
      const contentText = extractTextFromLexical(post.content as SerializedEditorState)
      contentMatch = contentText.toLowerCase().includes(query.toLowerCase())
    }

    // Category search
    let categoryMatch = false
    if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
      categoryMatch = post.categories.some((category) => {
        if (typeof category === 'object' && category !== null && category.title) {
          return category.title.toLowerCase().includes(query.toLowerCase())
        }
        return false
      })
    }

    return contentMatch || categoryMatch
  })

  // Merge and deduplicate results using a Map to avoid duplicates by ID
  const allResultsMap = new Map()

  // Add DB filtered posts
  dbFilteredPosts.docs.forEach((post) => {
    allResultsMap.set(post.id, post)
  })

  // Add content filtered posts
  contentFilteredPosts.forEach((post) => {
    allResultsMap.set(post.id, post)
  })

  // Create the final results object
  const totalResults = {
    docs: Array.from(allResultsMap.values()) as CardPostData[],
    totalDocs: allResultsMap.size,
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Arama</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="container">Arama sonuçları yükleniyor...</div>}>
        {totalResults.totalDocs > 0 ? (
          <CollectionArchive posts={totalResults.docs as CardPostData[]} />
        ) : (
          <div className="container">Arama sonucu bulunamadı.</div>
        )}
      </Suspense>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Bilgiç Hukuk Bürosu Arama`,
  }
}
