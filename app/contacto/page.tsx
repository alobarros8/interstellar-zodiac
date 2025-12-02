/**
 * Página de Contacto
 * Formulario para que los usuarios se contacten con el teatro
 * Campos: nombre, apellido, teléfono, email, mensaje
 * Los datos se guardan en la tabla 'users' de Supabase
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'
import styles from './contacto.module.css'

/**
 * Página de formulario de contacto
 */
export default function ContactPage() {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    /**
     * Maneja el envío del formulario de contacto
     * Guarda los datos en la tabla 'users' de Supabase
     * @param data - Datos del formulario validados
     */
    const onSubmit = async (data: ContactFormData) => {
        try {
            setError(null)
            setSuccess(false)
            setLoading(true)

            // Guardar en la tabla users
            const { error: dbError } = await supabase.from('users').insert([
                {
                    name_user: `${data.name} ${data.surname}`,
                    email_user: data.email,
                    number_user: parseInt(data.phone),
                },
            ])

            if (dbError) throw dbError

            // Mostrar mensaje de éxito y limpiar formulario
            setSuccess(true)
            reset()

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => setSuccess(false), 5000)
        } catch (error: any) {
            setError(error.message || 'Error al enviar el formulario')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Información de contacto */}
                    <div className={styles.infoSection}>
                        <h1 className={styles.title}>Contactanos</h1>
                        <p className={styles.subtitle}>
                            ¿Tienes alguna pregunta o consulta? Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                        </p>

                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <span>contacto@teatroestrella.com</span>
                            </div>

                            <div className={styles.contactItem}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>+54 11 1234-5678</span>
                            </div>

                            <div className={styles.contactItem}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span>Av. Corrientes 1234, Buenos Aires</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className={styles.formSection}>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                            {success && (
                                <div className={styles.successAlert}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
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

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>
                                        Nombre *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register('name')}
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        placeholder="Tu nombre"
                                    />
                                    {errors.name && (
                                        <span className={styles.errorMessage}>{errors.name.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="surname" className={styles.label}>
                                        Apellido *
                                    </label>
                                    <input
                                        id="surname"
                                        type="text"
                                        {...register('surname')}
                                        className={`${styles.input} ${errors.surname ? styles.inputError : ''}`}
                                        placeholder="Tu apellido"
                                    />
                                    {errors.surname && (
                                        <span className={styles.errorMessage}>{errors.surname.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="phone" className={styles.label}>
                                        Teléfono Celular *
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

                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email *
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
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.label}>
                                    Mensaje Personalizado *
                                </label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    {...register('message')}
                                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                                {errors.message && (
                                    <span className={styles.errorMessage}>{errors.message.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`${styles.submitButton} ${loading ? styles.buttonLoading : ''}`}
                            >
                                {loading ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
