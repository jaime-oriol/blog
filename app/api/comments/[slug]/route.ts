// app/api/comments/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

interface Comment {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  approved: boolean
  ip?: string
  userAgent?: string
  likes: number
  replies: Reply[]
  parentId?: string // Para respuestas anidadas
  avatar?: string // NUEVO: Avatar del usuario
}

interface Reply {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  approved: boolean
  likes: number
  avatar?: string // NUEVO: Avatar del usuario
}

interface CommentsData {
  postSlug: string
  comments: Comment[]
}

// Usar JSONBin.io como almacenamiento simple (gratis hasta 100k requests/mes)
const JSONBIN_API = 'https://api.jsonbin.io/v3/b'
const JSONBIN_KEY =
  process.env.JSONBIN_API_KEY || '$2a$10$viVRz9keKfVOYAHpSWQ8duX0ErkoHNNOc10PPYdwlFHdDH/i5IVgy'

// Función para leer comentarios de un post
async function getCommentsForPost(slug: string): Promise<CommentsData> {
  try {
    // En desarrollo local, devolver comentarios vacíos
    if (process.env.NODE_ENV === 'development') {
      return { postSlug: slug, comments: [] }
    }

    // En producción, intentar leer de JSONBin
    const binId = `comments-${slug.replace(/[^a-zA-Z0-9]/g, '_')}`
    const response = await fetch(`${JSONBIN_API}/${binId}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 404) {
      return { postSlug: slug, comments: [] }
    }

    if (!response.ok) {
      console.error('Error fetching from JSONBin:', response.status)
      return { postSlug: slug, comments: [] }
    }

    const data = await response.json()
    return data.record
  } catch (error) {
    console.error('Error reading comments:', error)
    return { postSlug: slug, comments: [] }
  }
}

// Función para guardar comentarios
async function saveCommentsForPost(slug: string, commentsData: CommentsData): Promise<void> {
  try {
    // En desarrollo local, solo hacer log
    if (process.env.NODE_ENV === 'development') {
      console.log('DEV: Would save comment:', commentsData)
      return
    }

    // En producción, guardar en JSONBin
    const binId = `comments-${slug.replace(/[^a-zA-Z0-9]/g, '_')}`

    // Primero intentar crear el bin si no existe
    const createResponse = await fetch(`${JSONBIN_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY,
        'X-Bin-Name': binId,
      },
      body: JSON.stringify(commentsData),
    })

    if (!createResponse.ok && createResponse.status !== 400) {
      throw new Error(`JSONBin create error: ${createResponse.status}`)
    }

    // Si el bin ya existe (400), actualizarlo
    if (createResponse.status === 400) {
      const updateResponse = await fetch(`${JSONBIN_API}/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_KEY,
        },
        body: JSON.stringify(commentsData),
      })

      if (!updateResponse.ok) {
        throw new Error(`JSONBin update error: ${updateResponse.status}`)
      }
    }
  } catch (error) {
    console.error('Error saving comments:', error)
    throw error
  }
}

// Validaciones
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500) // Máximo 500 caracteres
}

function generateCommentId(): string {
  return `comment-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}

// Detectar spam básico
function isLikelySpam(name: string, message: string): boolean {
  const spamKeywords = ['viagra', 'casino', 'bitcoin', 'crypto', 'loan', 'mortgage']
  const text = `${name} ${message}`.toLowerCase()

  // Detectar múltiples enlaces
  const linkCount = (text.match(/https?:\/\//g) || []).length
  if (linkCount > 2) return true

  // Detectar palabras spam
  return spamKeywords.some((keyword) => text.includes(keyword))
}

// GET - Obtener comentarios aprobados de un post
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const commentsData = await getCommentsForPost(slug)

    // Solo devolver comentarios aprobados
    const approvedComments = commentsData.comments.filter((comment) => comment.approved)

    return NextResponse.json({
      postSlug: slug,
      comments: approvedComments,
      total: approvedComments.length,
    })
  } catch (error) {
    console.error('Error getting comments:', error)
    return NextResponse.json({ error: 'Error obteniendo comentarios' }, { status: 500 })
  }
}

// POST - Agregar nuevo comentario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { name, email, message, avatar } = await request.json()

    // Validaciones básicas
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    // Sanitizar inputs
    const cleanName = sanitizeInput(name)
    const cleanMessage = sanitizeInput(message)

    if (cleanMessage.length < 10) {
      return NextResponse.json(
        { error: 'El comentario debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    // Detectar spam
    if (isLikelySpam(cleanName, cleanMessage)) {
      return NextResponse.json({ error: 'Comentario detectado como spam' }, { status: 400 })
    }

    // Crear nuevo comentario
    const newComment: Comment = {
      id: generateCommentId(),
      name: cleanName,
      email: email.toLowerCase(),
      message: cleanMessage,
      timestamp: new Date().toISOString(),
      approved: true, // Aprobación automática como solicitaste
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      likes: 0,
      replies: [],
      parentId: undefined,
      avatar: avatar || undefined, // NUEVO: Guardar avatar
    }

    // Leer comentarios existentes
    const commentsData = await getCommentsForPost(slug)

    // Añadir nuevo comentario
    commentsData.comments.push(newComment)

    // Guardar
    await saveCommentsForPost(slug, commentsData)

    // Respuesta exitosa
    return NextResponse.json({
      message: '¡Comentario publicado correctamente!',
      comment: {
        id: newComment.id,
        name: newComment.name,
        message: newComment.message,
        timestamp: newComment.timestamp,
        avatar: newComment.avatar,
      },
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
