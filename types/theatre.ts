/**
 * Tipos compartidos para el sistema de Teatro
 */

export type FunctionStatus = 'activo' | 'suspendido' | 'agotado' | 'finalizado'

export interface TheatreFunction {
    id: number
    nombre_funcion: string
    descripcion_funcion: string
    valor_entrada_funcion: number
    imagen_funcion: string
    fecha_funcion: string // ISO date format (YYYY-MM-DD)
    hora_funcion: string // Time format (HH:mm:ss)
    capacidad_total: number
    entradas_vendidas: number
    estado: FunctionStatus
    created_at?: string
}

export interface FunctionFormData {
    nombre_funcion: string
    descripcion_funcion: string
    valor_entrada_funcion: number
    fecha_funcion: string
    hora_funcion: string
    capacidad_total: number
    estado: FunctionStatus
}

// Helper: Calcular cupos disponibles
export function getCuposDisponibles(funcion: TheatreFunction): number {
    return funcion.capacidad_total - funcion.entradas_vendidas
}

// Helper: Verificar si una función está agotada
export function isFunctionAgotada(funcion: TheatreFunction): boolean {
    return funcion.entradas_vendidas >= funcion.capacidad_total || funcion.estado === 'agotado'
}

// Helper: Verificar si una función está disponible para compra
export function isFunctionDisponible(funcion: TheatreFunction): boolean {
    return funcion.estado === 'activo' && !isFunctionAgotada(funcion)
}

// Helper: Formatear fecha para mostrar (ej: "Sáb 7 Dic")
export function formatFecha(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00') // Evita problemas de timezone
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    }
    return date.toLocaleDateString('es-AR', options)
}

// Helper: Formatear hora (ej: "20:00")
export function formatHora(hora: string): string {
    return hora.substring(0, 5) // Obtiene HH:mm de HH:mm:ss
}

// Helper: Obtener color del badge según estado
export function getStatusColor(estado: FunctionStatus): string {
    const colors: Record<FunctionStatus, string> = {
        activo: '#10b981', // Verde
        suspendido: '#f59e0b', // Amarillo/Naranja
        agotado: '#ef4444', // Rojo
        finalizado: '#6b7280' // Gris
    }
    return colors[estado] || '#6b7280'
}

// Helper: Obtener label en español del estado
export function getStatusLabel(estado: FunctionStatus): string {
    const labels: Record<FunctionStatus, string> = {
        activo: 'Activo',
        suspendido: 'Suspendido',
        agotado: 'Agotado',
        finalizado: 'Finalizado'
    }
    return labels[estado] || estado
}
