/**
 * Página del Carrito de Compras
 * Muestra los items del carrito y permite proceder al checkout
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { createClient } from '@/lib/supabase/client'
import styles from './carrito.module.css'

/**
 * Componente de la página del carrito
 */
export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    /**
     * Procesar la compra
     */
    const handleCheckout = async () => {
        try {
            setLoading(true)
            setError(null)

            // Verificar que el usuario esté autenticado
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?redirect=/carrito')
                return
            }

            // Crear registros de compra para cada item
            const purchases = items.map(item => ({
                user_id: user.id,
                function_id: item.id,
                quantity: item.quantity,
                total_price: item.valor_entrada_funcion * item.quantity,
                status: 'completed' as const
            }))

            const { error: purchaseError } = await supabase
                .from('purchases')
                .insert(purchases)

            if (purchaseError) throw purchaseError

            // Limpiar el carrito
            clearCart()

            // Redirigir al historial de compras
            router.push('/historial?success=true')
        } catch (err: any) {
            console.error('Error al procesar compra:', err)
            setError(err.message || 'Error al procesar la compra')
        } finally {
            setLoading(false)
        }
    }

    // Carrito vacío
    if (items.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <div className={styles.emptyContent}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega funciones a tu carrito para continuar</p>
                    <a href="/funciones" className={styles.btnPrimary}>
                        Ver Funciones
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Carrito de Compras</h1>

                {error && (
                    <div className={styles.errorAlert}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className={styles.cartContent}>
                    {/* Lista de items */}
                    <div className={styles.itemsSection}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <img
                                    src={item.imagen_funcion || '/placeholder-show.jpg'}
                                    alt={item.nombre_funcion}
                                    className={styles.itemImage}
                                />

                                <div className={styles.itemDetails}>
                                    <h3 className={styles.itemName}>{item.nombre_funcion}</h3>
                                    <p className={styles.itemPrice}>
                                        ${item.valor_entrada_funcion.toLocaleString('es-AR')} / entrada
                                    </p>
                                </div>

                                <div className={styles.itemActions}>
                                    <div className={styles.quantityControl}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className={styles.quantityBtn}
                                            aria-label="Disminuir cantidad"
                                        >
                                            −
                                        </button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className={styles.quantityBtn}
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className={styles.itemTotal}>
                                        ${(item.valor_entrada_funcion * item.quantity).toLocaleString('es-AR')}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className={styles.removeBtn}
                                        aria-label="Eliminar item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen de compra */}
                    <div className={styles.summarySection}>
                        <div className={styles.summary}>
                            <h2 className={styles.summaryTitle}>Resumen de Compra</h2>

                            <div className={styles.summaryRow}>
                                <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                <span>${totalPrice.toLocaleString('es-AR')}</span>
                            </div>

                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>${totalPrice.toLocaleString('es-AR')}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className={`${styles.checkoutBtn} ${loading ? styles.btnLoading : ''}`}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Compra'}
                            </button>

                            <button
                                onClick={clearCart}
                                className={styles.clearBtn}
                                disabled={loading}
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
