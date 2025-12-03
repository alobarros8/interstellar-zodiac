/**
 * Gestión de Funciones (CRUD)
 * Permite listar, crear y eliminar funciones con upload de imágenes
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { uploadFunctionImage, validateImageFile } from '@/lib/upload-helpers'
import styles from '../admin.module.css'

type FunctionFormData = {
    nombre_funcion: string
    descripcion_funcion: string
    valor_entrada_funcion: number
}

export default function AdminFunctionsPage() {
    const [functions, setFunctions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
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

    // Manejar selección de archivo
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validar archivo
        const validation = validateImageFile(file)
        if (!validation.valid) {
            alert(validation.error)
            return
        }

        setImageFile(file)

        // Crear preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    // Crear función con upload de imagen
    const onSubmit = async (data: FunctionFormData) => {
        if (!imageFile) {
            alert('Por favor selecciona una imagen para la función')
            return
        }

        setUploading(true)
        try {
            // 1. Subir imagen a Storage
            console.log('Subiendo imagen...')
            const uploadResult = await uploadFunctionImage(imageFile)

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Error al subir imagen')
            }

            console.log('Imagen subida exitosamente:', uploadResult.url)

            // 2. Guardar función en DB con la URL de la imagen
            const { error } = await supabase
                .from('theatre_functions')
                .insert([{
                    ...data,
                    imagen_funcion: uploadResult.url
                }])

            if (error) {
                console.error('Error de Supabase:', error)
                throw new Error(`Error al guardar función: ${error.message}`)
            }

            // Éxito
            reset()
            setImageFile(null)
            setImagePreview(null)
            setIsCreating(false)
            loadFunctions()
            alert('Función creada correctamente')
        } catch (error: any) {
            console.error('Error completo:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setUploading(false)
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
                            rows={3}
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
                        />
                        <input
                            type="number"
                            {...register('valor_entrada_funcion', { required: true })}
                            placeholder="Precio ($)"
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
                        />

                        {/* Input de imagen */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Imagen de la función *
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleImageChange}
                                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem', width: '100%' }}
                            />
                            <small style={{ color: '#666', fontSize: '0.875rem' }}>
                                Formatos: JPG, PNG, WebP. Tamaño máximo: 5MB
                            </small>
                        </div>

                        {/* Preview de imagen */}
                        {imagePreview && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '300px',
                                        maxHeight: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '0.5rem',
                                        border: '2px solid #e5e7eb'
                                    }}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={uploading || !imageFile}
                            style={{
                                padding: '0.75rem',
                                background: uploading ? '#9ca3af' : '#059669',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            {uploading ? 'Subiendo imagen...' : 'Guardar Función'}
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
