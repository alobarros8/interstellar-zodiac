/**
 * Página de Solicitud de Recuperación de Contraseña
 * Permite al usuario ingresar su email para recibir un link de reset
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestResetSchema, type RequestResetFormData } from '@/lib/validations/password-reset'
import Link from 'next/link'
import styles from '../login/login.module.css' // Reutilizamos estilos de login

export default function RequestResetPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RequestResetFormData>({
        resolver: zodResolver(requestResetSchema),
    })

    const onSubmit = async (data: RequestResetFormData) => {
        try {
            setError(null)
            setLoading(true)

            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Error al enviar el correo')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <div className={styles.formHeader}>
                        <div className={styles.successIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h1 className={styles.title}>Correo Enviado</h1>
                        <p className={styles.subtitle}>
                            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                        </p>
                    </div>
                    <div className={styles.footer}>
                        <Link href="/login" className={styles.link}>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Recuperar Contraseña</h1>
                    <p className={styles.subtitle}>
                        Ingresa tu email y te enviaremos un enlace para restablecerla.
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
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.submitButton} ${loading ? styles.buttonLoading : ''}`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>

                    <div className={styles.footer}>
                        <Link href="/login" className={styles.link}>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
