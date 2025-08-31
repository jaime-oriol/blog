#!/usr/bin/env node
// Script para borrar TODOS los comentarios de Redis

import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

async function clearAllComments() {
  try {
    // Inicializar Redis
    const redis = new Redis({
      url: process.env.COMMENTS_KV_REST_API_URL,
      token: process.env.COMMENTS_KV_REST_API_TOKEN,
    })

    console.log('🔥 Iniciando limpieza completa de comentarios...')

    // Verificar variables de entorno
    if (!process.env.COMMENTS_KV_REST_API_URL || !process.env.COMMENTS_KV_REST_API_TOKEN) {
      console.error('❌ Variables de entorno faltantes. Verifica tu archivo .env.local')
      return
    }

    // Obtener todas las claves de comentarios
    const keys = await redis.keys('comments:*')
    console.log(`📊 Comentarios encontrados: ${keys.length} posts`)

    if (keys.length === 0) {
      console.log('✅ No hay comentarios para borrar')
      return
    }

    // Mostrar qué se va a borrar
    console.log('📝 Posts con comentarios:')
    for (const key of keys) {
      const data = await redis.get(key)
      const postSlug = key.replace('comments:', '')
      console.log(`   - ${postSlug}: ${data?.comments?.length || 0} comentarios`)
    }

    // Confirmar eliminación
    console.log('\n⚠️  ATENCIÓN: Se van a borrar TODOS los comentarios')
    console.log('🗑️  Borrando comentarios...')

    // Borrar todas las claves
    if (keys.length > 0) {
      await redis.del(...keys)
    }

    // Verificar que se borraron
    const remainingKeys = await redis.keys('comments:*')

    if (remainingKeys.length === 0) {
      console.log('✅ ¡Todos los comentarios han sido borrados exitosamente!')
      console.log(`📈 Resumen:`)
      console.log(`   - Posts limpiados: ${keys.length}`)
      console.log(
        `   - Comentarios eliminados: ${keys.reduce(async (sum, key) => {
          const data = await redis.get(key)
          return (await sum) + (data?.comments?.length || 0)
        }, Promise.resolve(0))}`
      )
      console.log(`   - Claves restantes: ${remainingKeys.length}`)
    } else {
      console.error('❌ Error: Aún quedan comentarios en Redis')
      console.log('Claves restantes:', remainingKeys)
    }
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
    process.exit(1)
  }
}

// Ejecutar limpieza
clearAllComments()
