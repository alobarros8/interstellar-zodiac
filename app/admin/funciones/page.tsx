/**
 * Gestión de Funciones (CRUD)
 * Permite listar, crear y eliminar funciones
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import styles from '../admin.module.css'

type FunctionFormData = {
    nombre_funcion: string
    descripcion_funcion: string
    valor_entrada_funcion: number
    imagen_funcion: string
}

export default function AdminFunctionsPage() {
    const [functions, setFunctions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const supabase = createClient()

    const { register, handleSubmit, reset } = useForm<FunctionFormData>()

    // Cargar funciones
    const loadFunctions = async () => {
        const { data } = await supabase
            .from('theatre_functions')
            .select('*')
            .order('id', { ascending: false })

        if (data) setFunctions(data)
        setLoading(false)
    }

    useEffect(() => {
        loadFunctions()
    }, [])

    // Crear función
    const onSubmit = async (data: FunctionFormData) => {
        try {
            const { error } = await supabase
                .from('theatre_functions')
                .insert([data])

            if (error) throw error

            reset()
            setIsCreating(false)
            loadFunctions()
            alert('Función creada correctamente')
        } catch (error: any) {
            alert('Error: ' + error.message)
        }
    }

    // Eliminar función
    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta función?')) return

        try {
            const { error } = await supabase
                .from('theatre_functions')
                .delete()
                .eq('id', id)

            if (error) throw error
            loadFunctions()
        } catch (error: any) {
            alert('Error: ' + error.message)
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 className={styles.sectionTitle}>Gestión de Funciones</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                    }}
                >
                    {isCreating ? 'Cancelar' : '+ Nueva Función'}
                </button>
            </div>

            {isCreating && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            {...register('nombre_funcion', { required: true })}
                            placeholder="Nombre de la obra"
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
                        />
                        <textarea
                            {...register('descripcion_funcion')}
                            placeholder="Descripción"
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
                        />
                        <input
                            type="number"
                            {...register('valor_entrada_funcion', { required: true })}
                            placeholder="Precio ($)"
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
                        />
                        <input
                            {...register('imagen_funcion')}
                            placeholder="URL de la imagen"
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
                        />
                        <button
                            type="submit"
                            style={{ padding: '0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                        >
                            Guardar Función
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {functions.map((func) => (
                    <div key={func.id} style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img src={func.imagen_funcion} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                            <div>
                                <h3 style={{ margin: 0 }}>{func.nombre_funcion}</h3>
                                <p style={{ margin: 0, color: '#666' }}>${func.valor_entrada_funcion}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(func.id)}
                            style={{ padding: '0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
