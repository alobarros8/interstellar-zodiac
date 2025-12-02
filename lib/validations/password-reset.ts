/**
 * Esquemas de validación para recuperación de contraseña
 */

import { z } from 'zod'
import { passwordSchema } from './auth'

/**
 * Esquema para solicitar recuperación (solo email)
 */
export const requestResetSchema = z.object({
    email: z.string().email('Email inválido'),
})

/**
 * Esquema para establecer nueva contraseña
 */
export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export type RequestResetFormData = z.infer<typeof requestResetSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
