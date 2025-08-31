// Sistema de comentarios con almacenamiento JSON local
import { promises as fs } from 'fs'
import path from 'path'
import type { CommentsData, Comment } from './shared-store'

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json')

interface CommentsDatabase {
  [postSlug: string]: CommentsData
}

// Función para leer todos los comentarios del archivo
export async function readCommentsFile(): Promise<CommentsDatabase> {
  try {
    const data = await fs.readFile(COMMENTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Si el archivo no existe, crear estructura vacía
    console.log('Creating new comments file...')
    const emptyDb: CommentsDatabase = {}
    await writeCommentsFile(emptyDb)
    return emptyDb
  }
}

// Función para escribir comentarios al archivo
export async function writeCommentsFile(database: CommentsDatabase): Promise<void> {
  try {
    // Crear directorio si no existe
    const dir = path.dirname(COMMENTS_FILE)
    await fs.mkdir(dir, { recursive: true })

    // Escribir archivo con formato bonito
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(database, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing comments file:', error)
    throw error
  }
}

// Función para obtener comentarios de un post específico
export async function getCommentsForPost(postSlug: string): Promise<CommentsData> {
  try {
    const database = await readCommentsFile()
    return database[postSlug] || { postSlug, comments: [] }
  } catch (error) {
    console.error('Error reading comments:', error)
    return { postSlug, comments: [] }
  }
}

// Función para guardar comentarios de un post específico
export async function saveCommentsForPost(
  postSlug: string,
  commentsData: CommentsData
): Promise<void> {
  try {
    const database = await readCommentsFile()
    database[postSlug] = commentsData
    await writeCommentsFile(database)
    console.log(`Comments saved locally for slug: ${postSlug}`)
  } catch (error) {
    console.error('Error saving comments:', error)
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
    console.error('Error adding comment:', error)
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
    const database = await readCommentsFile()
    const posts = Object.keys(database)
    const allComments = posts.flatMap((post) => database[post].comments)
    const recentComments = allComments
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return {
      totalPosts: posts.length,
      totalComments: allComments.length,
      recentComments,
    }
  } catch (error) {
    console.error('Error getting stats:', error)
    return { totalPosts: 0, totalComments: 0, recentComments: [] }
  }
}
