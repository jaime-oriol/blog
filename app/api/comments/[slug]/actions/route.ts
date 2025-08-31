// app/api/comments/[slug]/actions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import type { CommentsData, Comment, Reply } from '../../shared-store'
import { getCommentsForPost, saveCommentsForPost } from '../../kv-storage'

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
