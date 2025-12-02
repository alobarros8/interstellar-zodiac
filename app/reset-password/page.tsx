/**
 * Página de Restablecimiento de Contraseña
 * Permite al usuario establecer una nueva contraseña
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/password-reset'
import styles from '../login/login.module.css'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    // Verificar sesión al cargar
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // Si no hay sesión (link inválido o expirado), redirigir
                // Nota: Supabase maneja el token en la URL y crea la sesión automáticamente
            }
        })
    }, [supabase])

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            setError(null)
            setLoading(true)

            const { error } = await supabase.auth.updateUser({
                password: data.password,
            })

            if (error) throw error

            // Redirigir al login con mensaje de éxito
            router.push('/login?reset=success')
        } catch (err: any) {
            setError(err.message || 'Error al actualizar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Nueva Contraseña</h1>
                    <p className={styles.subtitle}>
                        Ingresa tu nueva contraseña segura.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {error && (
                        <div className={styles.errorAlert}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Nueva Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            placeholder="Mínimo 10 caracteres"
                        />
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                            placeholder="Repite la contraseña"
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.submitButton} ${loading ? styles.buttonLoading : ''}`}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    )
}
