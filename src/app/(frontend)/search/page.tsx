import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Helper function to extract text content from Lexical rich text
const extractTextFromLexical = (content: SerializedEditorState | undefined): string => {
  if (!content || !content.root) return ''

  // Extract text from root children
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

  return text.trim()
}

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // If there's no query, just get posts with default criteria
  if (!query) {
    const posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        content: true,
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

        {posts.totalDocs > 0 ? (
          <CollectionArchive posts={posts.docs as CardPostData[]} />
        ) : (
          <div className="container">Arama sonucu bulunamadı.</div>
        )}
      </div>
    )
  }

  // If there is a query, get all posts (with a higher limit) to search in content
  const allPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 100, // Increased limit to ensure we get enough posts to search through
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      content: true,
      isWorkArea: true,
    },
    pagination: false,
  })

  // Filter posts by all criteria including content and categories
  const filteredPosts = allPosts.docs.filter((post) => {
    // Check title, meta fields, and slug
    const titleMatch = post.title?.toLowerCase().includes(query.toLowerCase())
    const metaDescMatch = post.meta?.description?.toLowerCase().includes(query.toLowerCase())
    const metaTitleMatch = post.meta?.title?.toLowerCase().includes(query.toLowerCase())
    const slugMatch = post.slug?.toLowerCase().includes(query.toLowerCase())

    // Check content
    let contentMatch = false
    if (post.content) {
      const contentText = extractTextFromLexical(post.content as SerializedEditorState)
      contentMatch = contentText.toLowerCase().includes(query.toLowerCase())
    }

    // Check categories
    let categoryMatch = false
    if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
      categoryMatch = post.categories.some((category) => {
        if (typeof category === 'object' && category !== null && category.title) {
          return category.title.toLowerCase().includes(query.toLowerCase())
        }
        return false
      })
    }

    // Return true if any field matches
    return (
      titleMatch || metaDescMatch || metaTitleMatch || slugMatch || contentMatch || categoryMatch
    )
  })

  // Create results object with filtered posts
  const totalResults = {
    ...allPosts,
    docs: filteredPosts.map((post) => ({
      ...post,
      isWorkArea: post.isWorkArea,
    })),
    totalDocs: filteredPosts.length,
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

      {totalResults.totalDocs > 0 ? (
        <CollectionArchive posts={totalResults.docs as CardPostData[]} />
      ) : (
        <div className="container">Arama sonucu bulunamadı.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Bilgiç Hukuk Bürosu Arama`,
  }
}
