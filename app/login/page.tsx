/**
 * Página de Login
 * Permite a los usuarios iniciar sesión con email y contraseña
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import styles from './login.module.css'

/**
 * Componente de página de login
 */
export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    /**
     * Maneja el envío del formulario de login
     * @param data - Datos del formulario validados
     */
    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null)
            setLoading(true)

            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) throw error

            router.push('/')
            router.refresh()
        } catch (error: any) {
            setError(error.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Iniciar Sesión</h1>
                    <p className={styles.subtitle}>Ingresa a tu cuenta para comprar entradas</p>
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

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            placeholder="Tu contraseña"
                        />
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.submitButton} ${loading ? styles.buttonLoading : ''}`}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            ¿No tienes una cuenta?{' '}
                            <Link href="/register" className={styles.link}>
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
