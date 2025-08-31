// Sistema de comentarios con almacenamiento Vercel KV
import { kv } from '@vercel/kv'
import type { CommentsData, Comment } from './shared-store'

interface CommentsDatabase {
  [postSlug: string]: CommentsData
}

// Función para obtener comentarios de un post específico
export async function getCommentsForPost(postSlug: string): Promise<CommentsData> {
  try {
    const commentsData = await kv.get<CommentsData>(`comments:${postSlug}`)
    return commentsData || { postSlug, comments: [] }
  } catch (error) {
    console.error('Error reading comments from KV:', error)
    return { postSlug, comments: [] }
  }
}

// Función para guardar comentarios de un post específico
export async function saveCommentsForPost(
  postSlug: string,
  commentsData: CommentsData
): Promise<void> {
  try {
    await kv.set(`comments:${postSlug}`, commentsData)
    console.log(`Comments saved to KV for slug: ${postSlug}`)
  } catch (error) {
    console.error('Error saving comments to KV:', error)
    throw error
  }
}

// Función para añadir un comentario individual (más eficiente)
export async function addCommentToPost(postSlug: string, comment: Comment): Promise<void> {
  try {
    const commentsData = await getCommentsForPost(postSlug)
    commentsData.comments.push(comment)
    await saveCommentsForPost(postSlug, commentsData)
  } catch (error) {
    console.error('Error adding comment to KV:', error)
    throw error
  }
}

// Función para obtener estadísticas
export async function getCommentsStats(): Promise<{
  totalPosts: number
  totalComments: number
  recentComments: Comment[]
}> {
  try {
    // Obtener todas las claves de comentarios
    const keys = await kv.keys('comments:*')
    const totalPosts = keys.length

    // Obtener todos los comentarios
    const allCommentsData = await Promise.all(keys.map((key) => kv.get<CommentsData>(key)))

    const allComments = allCommentsData
      .filter((data): data is CommentsData => data !== null)
      .flatMap((data) => data.comments)

    const recentComments = allComments
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return {
      totalPosts,
      totalComments: allComments.length,
      recentComments,
    }
  } catch (error) {
    console.error('Error getting stats from KV:', error)
    return { totalPosts: 0, totalComments: 0, recentComments: [] }
  }
}

// Función para migrar datos existentes (si es necesario)
export async function migrateFromLocalToKV(localData: CommentsDatabase): Promise<void> {
  try {
    for (const [postSlug, commentsData] of Object.entries(localData)) {
      await saveCommentsForPost(postSlug, commentsData)
    }
    console.log('Migration to KV completed successfully')
  } catch (error) {
    console.error('Error during migration to KV:', error)
    throw error
  }
}
