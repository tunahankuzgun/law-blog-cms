import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputImage = path.join(__dirname, '../public/bilgic-hukuk.jpg')
const makalelerImage = path.join(__dirname, '../public/makaleler-og.webp')
const calismaAlanlariImage = path.join(__dirname, '../public/calisma-alanlari-og.webp')

// Function to check if file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath)
  } catch (_err) {
    return false
  }
}

// Optimize for Makaleler page if it doesn't exist
if (!fileExists(makalelerImage)) {
  console.log('Creating makaleler-og.webp...')
  sharp(inputImage)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toFile(makalelerImage)
} else {
  console.log('makaleler-og.webp already exists, skipping...')
}

// Optimize for Çalışma Alanları page if it doesn't exist
if (!fileExists(calismaAlanlariImage)) {
  console.log('Creating calisma-alanlari-og.webp...')
  sharp(inputImage)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toFile(calismaAlanlariImage)
} else {
  console.log('calisma-alanlari-og.webp already exists, skipping...')
}
