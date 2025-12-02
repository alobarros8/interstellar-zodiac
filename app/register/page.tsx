/**
 * Página de Registro
 * Permite a nuevos usuarios crear una cuenta
 * Contraseña debe tener: mínimo 10 caracteres y símbolo especial
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import styles from '../login/login.module.css'

/**
 * Componente de página de registro
 */
export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    /**
     * Maneja el envío del formulario de registro
     * @param data - Datos del formulario validados
     */
    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError(null)
            setLoading(true)

            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                    },
                },
            })

            if (error) throw error

            // Redirigir al usuario después del registro exitoso
            router.push('/')
            router.refresh()
        } catch (error: any) {
            setError(error.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Crear Cuenta</h1>
                    <p className={styles.subtitle}>Regístrate para comprar entradas</p>
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
                        <label htmlFor="name" className={styles.label}>
                            Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name')}
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                            placeholder="Tu nombre completo"
                        />
                        {errors.name && (
                            <span className={styles.errorMessage}>{errors.name.message}</span>
                        )}
                    </div>

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
                            placeholder="Mínimo 10 caracteres"
                        />
                        {!errors.password && (
                            <p className={styles.passwordRequirements}>
                                Debe tener al menos 10 caracteres y un símbolo especial (!@#$%^&*)
                            </p>
                        )}
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
                            placeholder="Repite tu contraseña"
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
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/login" className={styles.link}>
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
