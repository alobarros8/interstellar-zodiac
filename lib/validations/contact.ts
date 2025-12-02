/**
 * Esquemas de validación para el formulario de contacto
 * Utiliza Zod para validación de datos de contacto
 */

import { z } from 'zod'

/**
 * Esquema de validación para el formulario de contacto
 * Requisitos:
 * - Nombre: mínimo 2 caracteres
 * - Apellido: mínimo 2 caracteres
 * - Teléfono: formato numérico válido
 * - Email: formato válido
 * - Mensaje: mínimo 10 caracteres
 */
export const contactSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    surname: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos').regex(/^[0-9]+$/, 'El teléfono debe contener solo números'),
    email: z.string().email('Email inválido'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

/**
 * Tipo TypeScript inferido del esquema de contacto
 */
export type ContactFormData = z.infer<typeof contactSchema>
