/**
 * Página de Perfil de Usuario
 * Permite actualizar nombre y teléfono
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import Link from 'next/link'
import styles from './perfil.module.css'

/**
 * Componente de página de perfil
 */
export default function ProfilePage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    })

    /**
     * Cargar datos del usuario al montar
     */
    useEffect(() => {
        async function loadUserData() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?redirect=/perfil')
                return
            }

            setUserEmail(user.email || '')

            // Cargar datos de la tabla users
            const { data: userData } = await supabase
                .from('users')
                .select('name_user, number_user')
                .eq('user_id', user.id)
                .single()

            if (userData) {
                setValue('name', userData.name_user)
                if (userData.number_user) {
                    setValue('phone', userData.number_user.toString())
                }
            }
        }

        loadUserData()
    }, [supabase, router, setValue])

    /**
     * Actualizar datos del perfil
     */
    const onSubmit = async (data: ProfileFormData) => {
        try {
            setError(null)
            setSuccess(false)
            setLoading(true)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No autenticado')

            // Actualizar en la tabla users
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    name_user: data.name,
                    number_user: parseInt(data.phone),
                })
                .eq('user_id', user.id)

            if (updateError) throw updateError

            // Actualizar nombre en auth metadata
            await supabase.auth.updateUser({
                data: { name: data.name }
            })

            setSuccess(true)
            setTimeout(() => setSuccess(false), 5000)
        } catch (err: any) {
            setError(err.message || 'Error al actualizar perfil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Mi Perfil</h1>
                    <Link href="/historial" className={styles.linkButton}>
                        Ver Mis Compras
                    </Link>
                </div>

                <div className={styles.content}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        {success && (
                            <div className={styles.successAlert}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Perfil actualizado correctamente
                            </div>
                        )}

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
                                value={userEmail}
                                disabled
                                className={`${styles.input} ${styles.inputDisabled}`}
                            />
                            <span className={styles.helpText}>El email no se puede modificar</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                Nombre Completo *
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
                            <label htmlFor="phone" className={styles.label}>
                                Teléfono *
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                {...register('phone')}
                                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                placeholder="1122334455"
                            />
                            {errors.phone && (
                                <span className={styles.errorMessage}>{errors.phone.message}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`${styles.submitButton} ${loading ? styles.buttonLoading : ''}`}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </form>

                    <div className={styles.actions}>
                        <Link href="/recuperar-password" className={styles.secondaryButton}>
                            Cambiar Contraseña
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
