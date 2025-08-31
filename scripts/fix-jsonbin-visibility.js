// Script para hacer públicos los bins de comentarios existentes en JSONBin.io
// Ejecutar con: node scripts/fix-jsonbin-visibility.js

const JSONBIN_API = 'https://api.jsonbin.io/v3/b'
const JSONBIN_KEY =
  process.env.JSONBIN_API_KEY || '$2a$10$viVRz9keKfVOYAHpSWQ8duX0ErkoHNNOc10PPYdwlFHdDH/i5IVgy'

// Lista de bins de comentarios conocidos que necesitan ser públicos
const binIds = [
  'comments-J2_Girona',
  // Añadir más bin IDs aquí según sea necesario
]

async function makeBinPublic(binId) {
  try {
    console.log(`🔧 Intentando hacer público el bin: ${binId}`)

    // Primero obtener los datos actuales
    const getResponse = await fetch(`${JSONBIN_API}/${binId}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!getResponse.ok) {
      console.log(`❌ No se pudo obtener el bin ${binId}: ${getResponse.status}`)
      return false
    }

    const data = await getResponse.json()
    console.log(`📖 Datos obtenidos para ${binId}`)

    // Actualizar el bin con visibilidad pública
    const updateResponse = await fetch(`${JSONBIN_API}/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY,
        'X-Bin-Private': 'false', // Hacer público
      },
      body: JSON.stringify(data.record),
    })

    if (updateResponse.ok) {
      console.log(`✅ Bin ${binId} ahora es público`)
      return true
    } else {
      console.log(`❌ Error actualizando ${binId}: ${updateResponse.status}`)
      return false
    }
  } catch (error) {
    console.error(`❌ Error con ${binId}:`, error.message)
    return false
  }
}

async function fixAllBins() {
  console.log('🚀 Iniciando migración de bins a públicos...\n')

  let success = 0
  let failed = 0

  for (const binId of binIds) {
    const result = await makeBinPublic(binId)
    if (result) {
      success++
    } else {
      failed++
    }
    console.log('') // Línea en blanco para separar
  }

  console.log(`📊 Resultados:`)
  console.log(`   ✅ Exitosos: ${success}`)
  console.log(`   ❌ Fallidos: ${failed}`)
  console.log(`\n🎉 Migración completada. Los comentarios deberían funcionar ahora.`)
}

// Ejecutar script
fixAllBins().catch(console.error)
