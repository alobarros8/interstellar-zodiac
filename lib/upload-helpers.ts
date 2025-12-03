/**
 * Helper functions para subir imágenes a Supabase Storage
 */

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const BUCKET_NAME = 'function-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export type UploadResult = {
    success: boolean
    url?: string
    error?: string
}

/**
 * Sube una imagen al bucket de Storage y retorna la URL pública
 */
export async function uploadFunctionImage(file: File): Promise<UploadResult> {
    try {
        // Validar tipo de archivo
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                success: false,
                error: 'Tipo de archivo no permitido. Usa JPG, PNG o WebP'
            }
        }

        // Validar tamaño
        if (file.size > MAX_FILE_SIZE) {
            return {
                success: false,
                error: 'La imagen es muy grande. Tamaño máximo: 5MB'
            }
        }

        // Generar nombre único: timestamp + random + extensión original
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const extension = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomString}.${extension}`

        // Subir a Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Error uploading to Storage:', error)
            return {
                success: false,
                error: `Error al subir imagen: ${error.message}`
            }
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path)

        return {
            success: true,
            url: publicUrl
        }
    } catch (error: any) {
        console.error('Unexpected error:', error)
        return {
            success: false,
            error: error.message || 'Error inesperado al subir imagen'
        }
    }
}

/**
 * Elimina una imagen del Storage
 * Útil cuando se actualiza o elimina una función
 */
export async function deleteFunctionImage(imageUrl: string): Promise<boolean> {
    try {
        // Extraer el path del archivo de la URL
        const urlParts = imageUrl.split(`${BUCKET_NAME}/`)
        if (urlParts.length < 2) {
            console.warn('URL inválida, no se puede extraer el path')
            return false
        }

        const filePath = urlParts[1]

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath])

        if (error) {
            console.error('Error deleting from Storage:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error deleting image:', error)
        return false
    }
}

/**
 * Valida un archivo antes de subirlo (para usar en el frontend)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Tipo de archivo no permitido. Usa JPG, PNG o WebP'
        }
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: 'La imagen es muy grande. Tamaño máximo: 5MB'
        }
    }

    return { valid: true }
}
