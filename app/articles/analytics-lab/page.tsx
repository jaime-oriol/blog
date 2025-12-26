import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticlesLayout from '@/components/ArticlesLayout'

const POSTS_PER_PAGE = 4

export const metadata = genPageMetadata({
  title: 'Analytics Lab',
  description:
    'Laboratorio de datos y métricas. Machine Learning, IA y análisis estadístico avanzado aplicado al fútbol.',
})

export default async function AnalyticsLabPage() {
  const allPosts = allCoreContent(sortPosts(allBlogs))
  const publishedPosts = allPosts.filter((post) => !post.draft)

  const sectionPosts = publishedPosts.filter((post) => post.section === 'analytics-lab')

  const pageNumber = 1
  const totalPages = Math.ceil(sectionPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = sectionPosts.slice(0, POSTS_PER_PAGE)

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ArticlesLayout
      posts={sectionPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Analytics Lab"
      section="analytics-lab"
    />
  )
}
