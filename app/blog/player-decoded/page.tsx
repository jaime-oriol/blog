import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ArticlesLayout from '@/components/ArticlesLayout'

const POSTS_PER_PAGE = 4

export const metadata = genPageMetadata({
  title: 'Player Decoded',
  description:
    'Análisis profundo de jugadores individuales, perfiles tácticos y scouting avanzado.',
})

export default async function PlayerDecodedPage() {
  const allPosts = allCoreContent(sortPosts(allBlogs))
  const publishedPosts = allPosts.filter((post) => !post.draft)

  // Filtrar posts de esta sección y también posts legacy de 'tactical-structures'
  const sectionPosts = publishedPosts.filter(
    (post) =>
      post.section === 'player-decoded' ||
      post.section === 'tactical-analysis' ||
      post.section === 'tactical-structures'
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
      title="Player Decoded"
      section="player-decoded"
    />
  )
}
