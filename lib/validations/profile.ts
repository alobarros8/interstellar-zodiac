/**
 * Esquema de validación para actualización de perfil
 */

import { z } from 'zod'

/**
 * Esquema para actualización de perfil de usuario
 */
export const profileSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    phone: z.string()
        .min(8, 'El teléfono debe tener al menos 8 dígitos')
        .regex(/^[0-9]+$/, 'El teléfono debe contener solo números'),
})

/**
 * Tipo TypeScript inferido del esquema
 */
export type ProfileFormData = z.infer<typeof profileSchema>
