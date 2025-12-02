/**
 * Tipos TypeScript para el sistema de carrito y compras
 */

import { TheatreFunction } from './database.types'

/**
 * Item del carrito de compras
 */
export interface CartItem {
    id: number
    nombre_funcion: string
    valor_entrada_funcion: number
    imagen_funcion: string | null
    descripcion_funcion: string | null
    quantity: number
}

/**
 * Compra realizada por un usuario
 */
export interface Purchase {
    id: number
    user_id: string
    function_id: number
    quantity: number
    total_price: number
    purchase_date: string
    status: 'completed' | 'pending' | 'cancelled'
}

/**
 * Compra con detalles de la función
 */
export interface PurchaseWithDetails extends Purchase {
    nombre_funcion: string
    descripcion_funcion: string | null
    imagen_funcion: string | null
    valor_entrada_funcion: number
}

/**
 * Tipo para insertar nuevas compras
 */
export type PurchaseInsert = Omit<Purchase, 'id' | 'purchase_date'>
