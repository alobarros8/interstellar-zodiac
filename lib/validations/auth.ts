/**
 * Esquemas de validación para autenticación
 * Utiliza Zod para validación de formularios con reglas personalizadas
 */

import { z } from 'zod'

/**
 * Expresión regular para validar que la contraseña contenga al menos un símbolo especial
 */
const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

/**
 * Esquema base para validación de contraseña
 */
export const passwordSchema = z
    .string()
    .min(10, 'La contraseña debe tener al menos 10 caracteres')
    .regex(specialCharRegex, 'La contraseña debe contener al menos un símbolo especial')

/**
 * Esquema de validación para el formulario de registro
 * Requisitos:
 * - Nombre: mínimo 2 caracteres
 * - Email: formato válido
 * - Contraseña: mínimo 10 caracteres y debe contener al menos un símbolo especial
 * - Confirmación de contraseña: debe coincidir con la contraseña
 */
export const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})

/**
 * Tipo TypeScript inferido del esquema de registro
 */
export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Esquema de validación para el formulario de login
 */
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
})

/**
 * Tipo TypeScript inferido del esquema de login
 */
export type LoginFormData = z.infer<typeof loginSchema>
