import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { sortPostsWithPinned } from '@/lib/sortPosts'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPostsWithPinned(allCoreContent(sortPosts(allBlogs)))
  const publishedPosts = sortedPosts.filter((post) => !post.draft)
  const recentPosts = publishedPosts.slice(0, 4)

  return <Main posts={recentPosts} />
}
