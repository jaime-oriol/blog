import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ArticleCard from '@/components/ArticleCard'

export default function OptaBanner() {
  const allPosts = allCoreContent(sortPosts(allBlogs))
  const optaPost = allPosts.find((post) => post.pinned)

  if (!optaPost) return null

  return (
    <div className="mt-8 mb-12">
      <h3 className="font-headings mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Opta Forum 2026
      </h3>
      <ArticleCard post={optaPost} />
    </div>
  )
}
