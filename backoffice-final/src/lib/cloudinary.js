// src/lib/cloudinary.js
// Service d'upload d'images vers Cloudinary
// Créer un compte gratuit sur cloudinary.com
// Dashboard → Settings → Upload → Add upload preset (mode: unsigned)

const CLOUD_NAME  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME  || 'VOTRE_CLOUD_NAME'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'VOTRE_UPLOAD_PRESET'

/**
 * Upload une image vers Cloudinary
 * @param {File} file - Le fichier image
 * @param {string} folder - Dossier dans Cloudinary (ex: 'portfolio/projects')
 * @param {string} resourceType - Type de ressource ('auto', 'image', 'raw', 'video')
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(file, folder = 'portfolio', resourceType = 'auto') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Upload failed')
  }

  const data = await res.json()
  return {
    url:      data.secure_url,
    publicId: data.public_id,
  }
}

/**
 * Générer une URL Cloudinary avec transformations
 * @param {string} publicId
 * @param {object} opts - { width, height, crop, quality }
 */
export function cloudinaryUrl(publicId, opts = {}) {
  const { width = 800, height = '', crop = 'fill', quality = 'auto' } = opts
  const transforms = [
    `w_${width}`,
    height ? `h_${height}` : '',
    `c_${crop}`,
    `q_${quality}`,
    'f_auto',
  ].filter(Boolean).join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

/**
 * Composable Vue pour upload avec état
 */
import { ref } from 'vue'
export function useCloudinaryUpload() {
  const uploading  = ref(false)
  const uploadError = ref(null)
  const uploadedUrl = ref(null)

  const upload = async (file, folder = 'portfolio', resourceType = 'auto') => {
    uploading.value   = true
    uploadError.value = null
    try {
      const result = await uploadImage(file, folder, resourceType)
      uploadedUrl.value = result.url
      return result
    } catch (e) {
      uploadError.value = e.message
      throw e
    } finally {
      uploading.value = false
    }
  }

  return { uploading, uploadError, uploadedUrl, upload }
}
