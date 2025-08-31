// app/api/comments/[slug]/actions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { memoryStore } from '../../shared-store'
import type { CommentsData, Comment, Reply } from '../../shared-store'

// Usar JSONBin.io como almacenamiento (mismo que route.ts principal)
const JSONBIN_API = 'https://api.jsonbin.io/v3/b'
const JSONBIN_KEY =
  process.env.JSONBIN_API_KEY || '$2a$10$viVRz9keKfVOYAHpSWQ8duX0ErkoHNNOc10PPYdwlFHdDH/i5IVgy'

// Función para leer comentarios de un post (usando JSONBin con fallback a memoria)
async function getCommentsForPost(slug: string): Promise<CommentsData> {
  try {
    // En desarrollo, usar almacenamiento en memoria si JSONBin falla
    if (process.env.NODE_ENV === 'development') {
      try {
        const binId = `comments-${slug.replace(/[^a-zA-Z0-9]/g, '_')}`
        const response = await fetch(`${JSONBIN_API}/${binId}/latest`, {
          headers: {
            'X-Master-Key': JSONBIN_KEY,
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 404) {
          return memoryStore[slug] || { postSlug: slug, comments: [] }
        }

        if (response.ok) {
          const data = await response.json()
          return data.record
        }
      } catch (error) {
        console.log('JSONBin not available in actions, using memory store')
      }

      return memoryStore[slug] || { postSlug: slug, comments: [] }
    }

    // En producción, solo usar JSONBin
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

// Función para guardar comentarios (usando JSONBin con fallback a memoria)
async function saveCommentsForPost(slug: string, commentsData: CommentsData): Promise<void> {
  try {
    // En desarrollo, usar almacenamiento en memoria si JSONBin falla
    if (process.env.NODE_ENV === 'development') {
      try {
        const binId = `comments-${slug.replace(/[^a-zA-Z0-9]/g, '_')}`

        const createResponse = await fetch(`${JSONBIN_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_KEY,
            'X-Bin-Name': binId,
          },
          body: JSON.stringify(commentsData),
        })

        if (createResponse.ok) {
          console.log(`Comments saved to JSONBin (actions) for slug: ${slug}`)
          return
        }

        if (createResponse.status === 400) {
          const updateResponse = await fetch(`${JSONBIN_API}/${binId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_KEY,
            },
            body: JSON.stringify(commentsData),
          })

          if (updateResponse.ok) {
            console.log(`Comments updated in JSONBin (actions) for slug: ${slug}`)
            return
          }
        }
      } catch (error) {
        console.log('JSONBin not available in actions, falling back to memory store')
      }

      // Fallback a almacenamiento en memoria para desarrollo
      memoryStore[slug] = commentsData
      console.log(`Comments saved to memory store (actions) for slug: ${slug}`)
      return
    }

    // En producción, solo usar JSONBin
    const binId = `comments-${slug.replace(/[^a-zA-Z0-9]/g, '_')}`

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

    console.log(`Comments updated successfully for slug: ${slug}`)
  } catch (error) {
    console.error('Error saving comments:', error)
    throw error
  }
}

function generateId(): string {
  return `reply-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500)
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST - Manejar acciones (like, responder)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { action, commentId, name, email, message } = await request.json()

    switch (action) {
      case 'like':
        return await handleLike(slug, commentId)

      case 'reply':
        return await handleReply(slug, commentId, name, email, message, request)

      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error handling action:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Manejar likes
async function handleLike(slug: string, commentId: string) {
  try {
    const commentsData = await getCommentsForPost(slug)

    // Buscar el comentario principal
    const commentIndex = commentsData.comments.findIndex((c) => c.id === commentId)

    if (commentIndex !== -1) {
      // Es un comentario principal
      commentsData.comments[commentIndex].likes += 1
      await saveCommentsForPost(slug, commentsData)

      return NextResponse.json({
        success: true,
        likes: commentsData.comments[commentIndex].likes,
        commentId: commentId,
      })
    }

    // Buscar en las respuestas
    for (let i = 0; i < commentsData.comments.length; i++) {
      const replyIndex = commentsData.comments[i].replies.findIndex((r) => r.id === commentId)
      if (replyIndex !== -1) {
        commentsData.comments[i].replies[replyIndex].likes += 1
        await saveCommentsForPost(slug, commentsData)

        return NextResponse.json({
          success: true,
          likes: commentsData.comments[i].replies[replyIndex].likes,
          commentId: commentId,
        })
      }
    }

    return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 })
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Manejar respuestas
async function handleReply(
  slug: string,
  parentId: string,
  name: string,
  email: string,
  message: string,
  request: NextRequest
) {
  try {
    // Validaciones
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    const cleanName = sanitizeInput(name)
    const cleanMessage = sanitizeInput(message)

    if (cleanMessage.length < 5) {
      return NextResponse.json(
        { error: 'La respuesta debe tener al menos 5 caracteres' },
        { status: 400 }
      )
    }

    const commentsData = await getCommentsForPost(slug)

    // Buscar el comentario padre
    const parentIndex = commentsData.comments.findIndex((c) => c.id === parentId)

    if (parentIndex === -1) {
      return NextResponse.json({ error: 'Comentario padre no encontrado' }, { status: 404 })
    }

    // Crear nueva respuesta
    const newReply: Reply = {
      id: generateId(),
      name: cleanName,
      email: email.toLowerCase(),
      message: cleanMessage,
      timestamp: new Date().toISOString(),
      approved: true, // Aprobación automática
      likes: 0,
    }

    // Añadir respuesta al comentario padre
    commentsData.comments[parentIndex].replies.push(newReply)

    // Guardar
    await saveCommentsForPost(slug, commentsData)

    return NextResponse.json({
      message: '¡Respuesta enviada correctamente!',
      reply: {
        id: newReply.id,
        name: newReply.name,
        message: newReply.message,
        timestamp: newReply.timestamp,
        likes: newReply.likes,
      },
    })
  } catch (error) {
    console.error('Error adding reply:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
