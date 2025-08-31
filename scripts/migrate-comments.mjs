#!/usr/bin/env node
// Script para migrar comentarios desde JSON local a Redis

import { readFileSync } from 'fs'
import { Redis } from '@upstash/redis'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Ruta del archivo de comentarios JSON
const COMMENTS_FILE = path.join(__dirname, '..', 'data', 'comments.json')

async function migrateComments() {
  try {
    // Inicializar Redis con variables de entorno correctas
    const redis = new Redis({
      url: process.env.COMMENTS_KV_REST_API_URL,
      token: process.env.COMMENTS_KV_REST_API_TOKEN,
    })

    console.log('🔄 Iniciando migración de comentarios...')

    // Debug: mostrar variables de entorno
    console.log('Variables de entorno disponibles:')
    console.log('- COMMENTS_KV_REST_API_URL:', process.env.COMMENTS_KV_REST_API_URL)
    console.log(
      '- COMMENTS_KV_REST_API_TOKEN:',
      process.env.COMMENTS_KV_REST_API_TOKEN ? 'SET' : 'MISSING'
    )

    if (!process.env.COMMENTS_KV_REST_API_URL || !process.env.COMMENTS_KV_REST_API_TOKEN) {
      console.error('❌ Variables de entorno faltantes. Verifica tu archivo .env.local')
      return
    }

    // Leer datos del archivo JSON
    let localData
    try {
      const jsonData = readFileSync(COMMENTS_FILE, 'utf8')
      localData = JSON.parse(jsonData)
      console.log(`📖 Datos leídos del archivo JSON:`, Object.keys(localData))
    } catch (error) {
      console.log('⚠️  No se encontró archivo comments.json o está vacío')
      return
    }

    // Migrar cada post
    let migratedPosts = 0
    let migratedComments = 0

    for (const [postSlug, commentsData] of Object.entries(localData)) {
      console.log(`🚀 Migrando post: ${postSlug}`)
      console.log(`   💬 Comentarios: ${commentsData.comments.length}`)

      // Guardar en Redis
      await redis.set(`comments:${postSlug}`, commentsData)

      migratedPosts++
      migratedComments += commentsData.comments.length

      console.log(`   ✅ Post migrado exitosamente`)
    }

    // Verificar migración
    console.log('🔍 Verificando migración...')
    const keys = await redis.keys('comments:*')
    console.log(`   📊 Posts en Redis: ${keys.length}`)

    // Verificar contenido específico
    for (const key of keys) {
      const data = await redis.get(key)
      const postSlug = key.replace('comments:', '')
      console.log(`   📝 ${postSlug}: ${data.comments.length} comentarios`)
    }

    console.log('✨ ¡Migración completada exitosamente!')
    console.log(`📈 Resumen:`)
    console.log(`   - Posts migrados: ${migratedPosts}`)
    console.log(`   - Comentarios migrados: ${migratedComments}`)
    console.log(`   - Posts verificados en Redis: ${keys.length}`)
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  }
}

// Ejecutar migración
migrateComments()
