// Sistema de comentarios con almacenamiento Upstash Redis
import { Redis } from '@upstash/redis'
import type { CommentsData, Comment } from './shared-store'

interface CommentsDatabase {
  [postSlug: string]: CommentsData
}

// Inicializar Redis client con variables de entorno específicas
const redis = new Redis({
  url: process.env.COMMENTS_KV_REST_API_URL!,
  token: process.env.COMMENTS_KV_REST_API_TOKEN!,
})

// Función para obtener comentarios de un post específico
export async function getCommentsForPost(postSlug: string): Promise<CommentsData> {
  try {
    const commentsData = await redis.get<CommentsData>(`comments:${postSlug}`)
    return commentsData || { postSlug, comments: [] }
  } catch (error) {
    console.error('Error reading comments from Redis:', error)
    return { postSlug, comments: [] }
  }
}

// Función para guardar comentarios de un post específico
export async function saveCommentsForPost(
  postSlug: string,
  commentsData: CommentsData
): Promise<void> {
  try {
    await redis.set(`comments:${postSlug}`, commentsData)
    console.log(`Comments saved to Redis for slug: ${postSlug}`)
  } catch (error) {
    console.error('Error saving comments to Redis:', error)
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
    console.error('Error adding comment to Redis:', error)
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
    const keys = await redis.keys('comments:*')
    const totalPosts = keys.length

    // Obtener todos los comentarios
    const allCommentsData = await Promise.all(keys.map((key) => redis.get<CommentsData>(key)))

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
    console.error('Error getting stats from Redis:', error)
    return { totalPosts: 0, totalComments: 0, recentComments: [] }
  }
}

// Función para migrar datos existentes (si es necesario)
export async function migrateFromLocalToRedis(localData: CommentsDatabase): Promise<void> {
  try {
    for (const [postSlug, commentsData] of Object.entries(localData)) {
      await saveCommentsForPost(postSlug, commentsData)
    }
    console.log('Migration to Redis completed successfully')
  } catch (error) {
    console.error('Error during migration to Redis:', error)
    throw error
  }
}
