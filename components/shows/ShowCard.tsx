/**
 * Componente ShowCard
 * Tarjeta reutilizable para mostrar información de una función de teatro
 * Muestra: imagen, nombre, descripción y precio
 */

'use client'

import { TheatreFunction } from '@/types/database.types'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import styles from './ShowCard.module.css'

interface ShowCardProps {
    show: TheatreFunction
}

/**
 * Componente de tarjeta de función
 * @param show - Datos de la función de teatro
 */
export default function ShowCard({ show }: ShowCardProps) {
    const { addItem } = useCart()
    const [added, setAdded] = useState(false)

    // Imagen placeholder si no hay imagen
    const imageUrl = show.imagen_funcion || '/placeholder-show.jpg'

    // Formatear precio
    const formattedPrice = show.valor_entrada_funcion
        ? `$${show.valor_entrada_funcion.toLocaleString('es-AR')}`
        : 'Precio a confirmar'

    /**
     * Agregar función al carrito
     */
    const handleAddToCart = () => {
        addItem(show)
        setAdded(true)

        // Resetear animación después de 2 segundos
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={imageUrl}
                    alt={show.nombre_funcion}
                    className={styles.image}
                    onError={(e) => {
                        // Fallback si la imagen no carga
                        e.currentTarget.src = '/placeholder-show.jpg'
                    }}
                />
                <div className={styles.priceTag}>
                    {formattedPrice}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{show.nombre_funcion}</h3>
                <p className={styles.description}>
                    {show.descripcion_funcion || 'Sin descripción disponible'}
                </p>

                <button
                    onClick={handleAddToCart}
                    className={`${styles.buyButton} ${added ? styles.buttonAdded : ''}`}
                    disabled={!show.valor_entrada_funcion}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        {added ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        )}
                    </svg>
                    {added ? 'Agregado' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
    )
}
