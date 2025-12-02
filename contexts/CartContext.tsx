/**
 * CartContext - Contexto global para el carrito de compras
 * Maneja el estado del carrito y persistencia en localStorage
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '@/types/cart.types'
import { TheatreFunction } from '@/types/database.types'

/**
 * Interfaz del contexto del carrito
 */
interface CartContextType {
    items: CartItem[]
    addItem: (show: TheatreFunction, quantity?: number) => void
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
}

/**
 * Crear el contexto
 */
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Hook personalizado para usar el contexto del carrito
 */
export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart debe usarse dentro de un CartProvider')
    }
    return context
}

/**
 * Props del provider
 */
interface CartProviderProps {
    children: ReactNode
}

/**
 * Provider del contexto del carrito
 * Maneja toda la lógica del carrito y persistencia
 */
export function CartProvider({ children }: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    /**
     * Cargar items del localStorage al montar
     */
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                setItems(parsedCart)
            } catch (error) {
                console.error('Error al cargar el carrito:', error)
            }
        }
        setIsLoaded(true)
    }, [])

    /**
     * Guardar items en localStorage cuando cambien
     */
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    /**
     * Agregar un item al carrito
     * Si ya existe, incrementa la cantidad
     */
    const addItem = (show: TheatreFunction, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === show.id)

            if (existingItem) {
                // Si ya existe, incrementar cantidad
                return prevItems.map((item) =>
                    item.id === show.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // Si no existe, agregar nuevo item
                const newItem: CartItem = {
                    id: show.id,
                    nombre_funcion: show.nombre_funcion,
                    valor_entrada_funcion: show.valor_entrada_funcion || 0,
                    imagen_funcion: show.imagen_funcion,
                    descripcion_funcion: show.descripcion_funcion,
                    quantity: quantity,
                }
                return [...prevItems, newItem]
            }
        })
    }

    /**
     * Eliminar un item del carrito
     */
    const removeItem = (id: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }

    /**
     * Actualizar la cantidad de un item
     */
    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id)
            return
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        )
    }

    /**
     * Vaciar el carrito
     */
    const clearCart = () => {
        setItems([])
    }

    /**
     * Calcular total de items
     */
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    /**
     * Calcular precio total
     */
    const totalPrice = items.reduce(
        (sum, item) => sum + item.valor_entrada_funcion * item.quantity,
        0
    )

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
