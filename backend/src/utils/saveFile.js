import fs from 'fs'
import path from 'path'

/**
 * Saves uploaded file to /public/{slug}/images/
 * Returns URL like: https://www.yourdomain.com/sobha-trinity/images/hoskote.webp
 */
export const saveFile = (file, slug = 'general') => {
  if (!file) return ''

  const baseUrl = process.env.BASE_URL || 'http://localhost:8081'

  // Clean slug for folder name
  const folderName = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')

  // Create directory if not exists
  const uploadDir = path.join(process.cwd(), 'public', folderName, 'images')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // file.filename already has clean name from multer (set in upload.middleware.js)
  const filename = file.filename
  const destPath = path.join(uploadDir, filename)

  // Move from temp to final destination
  fs.renameSync(file.path, destPath)

  return `${baseUrl}/${folderName}/images/${filename}`
}

/**
 * Deletes a file from server given its full URL
 */
export const deleteFile = (fileUrl) => {
  if (!fileUrl) return
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8081'
    const relativePath = fileUrl.replace(baseUrl, '')
    const filePath = path.join(process.cwd(), 'public', relativePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (err) {
    console.error('Delete file error:', err)
  }
}