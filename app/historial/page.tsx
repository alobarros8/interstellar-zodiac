/**
 * Página de Historial de Compras
 * Muestra todas las compras realizadas por el usuario
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PurchaseWithDetails } from '@/types/cart.types'
import styles from './historial.module.css'

/**
 * Componente de página de historial
 */
export default function HistoryPage() {
    const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()
    const showSuccess = searchParams.get('success') === 'true'
    const supabase = createClient()

    /**
     * Cargar compras del usuario
     */
    useEffect(() => {
        async function loadPurchases() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?redirect=/historial')
                return
            }

            // Usar la vista purchases_with_details o hacer JOIN manual
            const { data, error } = await supabase
                .from('purchases')
                .select(`
          *,
          theatre_functions (
            nombre_funcion,
            descripcion_funcion,
            imagen_funcion,
            valor_entrada_funcion
          )
        `)
                .eq('user_id', user.id)
                .order('purchase_date', { ascending: false })

            if (error) {
                console.error('Error al cargar compras:', error)
            } else {
                // Transformar datos
                const transformedData = data?.map(purchase => ({
                    ...purchase,
                    nombre_funcion: purchase.theatre_functions?.nombre_funcion || '',
                    descripcion_funcion: purchase.theatre_functions?.descripcion_funcion || null,
                    imagen_funcion: purchase.theatre_functions?.imagen_funcion || null,
                    valor_entrada_funcion: purchase.theatre_functions?.valor_entrada_funcion || 0,
                })) || []

                setPurchases(transformedData as any)
            }

            setLoading(false)
        }

        loadPurchases()
    }, [supabase, router])

    /**
     * Formatear fecha
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    /**
     * Obtener color del estado
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return styles.statusCompleted
            case 'pending': return styles.statusPending
            case 'cancelled': return styles.statusCancelled
            default: return ''
        }
    }

    /**
     * Traducir estado
     */
    const translateStatus = (status: string) => {
        switch (status) {
            case 'completed': return 'Completado'
            case 'pending': return 'Pendiente'
            case 'cancelled': return 'Cancelado'
            default: return status
        }
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Cargando historial...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Mis Compras</h1>

                {showSuccess && (
                    <div className={styles.successAlert}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ¡Compra realizada con éxito! Tus entradas han sido procesadas.
                    </div>
                )}

                {purchases.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        <h2>No tienes compras aún</h2>
                        <p>Explora nuestras funciones y adquiere tus entradas</p>
                        <a href="/funciones" className={styles.btnPrimary}>
                            Ver Funciones
                        </a>
                    </div>
                ) : (
                    <div className={styles.purchasesList}>
                        {purchases.map((purchase) => (
                            <div key={purchase.id} className={styles.purchaseCard}>
                                <img
                                    src={purchase.imagen_funcion || '/placeholder-show.jpg'}
                                    alt={purchase.nombre_funcion}
                                    className={styles.purchaseImage}
                                />

                                <div className={styles.purchaseDetails}>
                                    <h3 className={styles.purchaseName}>{purchase.nombre_funcion}</h3>
                                    <p className={styles.purchaseDate}>
                                        {formatDate(purchase.purchase_date)}
                                    </p>

                                    <div className={styles.purchaseInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Cantidad:</span>
                                            <span className={styles.infoValue}>{purchase.quantity} entrada{purchase.quantity > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Total:</span>
                                            <span className={styles.infoValue}>${purchase.total_price.toLocaleString('es-AR')}</span>
                                        </div>
                                    </div>

                                    <span className={`${styles.status} ${getStatusColor(purchase.status)}`}>
                                        {translateStatus(purchase.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
