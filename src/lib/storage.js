import { supabase } from './supabase'

const MUSIC_BUCKET = 'music'
const COVERS_BUCKET = 'covers'

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The bucket name ('music' or 'covers')
 * @param {string} key - The storage key/path (optional)
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(file, bucket = MUSIC_BUCKET, key) {
  if (!key) {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    key = `${timestamp}-${randomString}-${file.name.replace(/\s+/g, '-')}`
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(key, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(key)

  return publicUrl
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} key - The storage key/path or full URL
 * @returns {Promise<void>}
 */
export async function deleteFile(bucket, key) {
  // Extract just the filename if a full URL is provided
  let cleanKey = key
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl('')
  
  if (key.includes(urlData.publicUrl)) {
    cleanKey = key.replace(urlData.publicUrl, '')
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([cleanKey])

  if (error) {
    console.error('Delete error:', error)
    throw error
  }
}

/**
 * Get a signed URL for private file access (if needed)
 * @param {string} bucket - The bucket name
 * @param {string} key - The storage key/path
 * @param {number} expiresIn - Seconds until expiration (default: 3600)
 * @returns {Promise<string>} - The signed URL
 */
export async function getSignedFileUrl(bucket, key, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, expiresIn)

  if (error) {
    console.error('Signed URL error:', error)
    throw error
  }

  return data.signedUrl
}

/**
 * List files in a bucket
 * @param {string} bucket - The bucket name
 * @param {string} prefix - Optional prefix to filter files
 * @returns {Promise<Array>} - Array of file objects
 */
export async function listFiles(bucket, prefix = '') {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(prefix, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    console.error('List files error:', error)
    throw error
  }

  return data || []
}

/**
 * Get the storage key from a public URL
 * @param {string} url - The public URL
 * @param {string} bucket - The bucket name
 * @returns {string} - The storage key
 */
export function getKeyFromUrl(url, bucket) {
  if (!url) return null
  
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl('')
  if (url.startsWith(urlData.publicUrl)) {
    return url.replace(urlData.publicUrl, '')
  }
  return url.split('/').pop()
}

export const storageService = {
  uploadFile,
  deleteFile,
  getSignedFileUrl,
  listFiles,
  getKeyFromUrl,
  MUSIC_BUCKET,
  COVERS_BUCKET
}
