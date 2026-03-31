import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { sortPostsWithPinned } from '@/lib/sortPosts'
import ArticlesLayout from '@/components/ArticlesLayout'

const POSTS_PER_PAGE = 4

export const metadata = genPageMetadata({
  title: 'Team Architecture',
  description:
    'Estudio de equipos y sus filosofías. Sistemas organizativos, principios tácticos e identidad colectiva.',
})

export default async function TeamArchitecturePage() {
  const allPosts = sortPostsWithPinned(allCoreContent(sortPosts(allBlogs)))
  const publishedPosts = allPosts.filter((post) => !post.draft)

  // Filtrar posts de esta sección y también posts legacy de 'tactical-metrics-lab'
  const sectionPosts = publishedPosts.filter(
    (post) =>
      post.section === 'team-architecture' ||
      post.section === 'advanced-metrics' ||
      post.section === 'tactical-metrics-lab'
  )

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
      title="Team Architecture"
      section="team-architecture"
    />
  )
}
