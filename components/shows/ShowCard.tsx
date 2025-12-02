/**
 * Componente ShowCard
 * Tarjeta reutilizable para mostrar información de una función de teatro
 * Muestra: imagen, nombre, descripción y precio
 */

import { TheatreFunction } from '@/types/database.types'
import styles from './ShowCard.module.css'

interface ShowCardProps {
    show: TheatreFunction
}

/**
 * Componente de tarjeta de función
 * @param show - Datos de la función de teatro
 */
export default function ShowCard({ show }: ShowCardProps) {
    // Imagen placeholder si no hay imagen
    const imageUrl = show.imagen_funcion || '/placeholder-show.jpg'

    // Formatear precio
    const formattedPrice = show.valor_entrada_funcion
        ? `$${show.valor_entrada_funcion.toLocaleString('es-AR')}`
        : 'Precio a confirmar'

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

                <button className={styles.buyButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                    Comprar Entradas
                </button>
            </div>
        </div>
    )
}
