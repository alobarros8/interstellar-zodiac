/**
 * Listado de Ventas
 * Muestra todas las compras realizadas
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from '../admin.module.css'

export default function AdminSalesPage() {
    const [sales, setSales] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadSales() {
            // Usamos la vista purchases_with_details si es posible, o hacemos JOIN
            const { data, error } = await supabase
                .from('purchases')
                .select(`
          *,
          theatre_functions (nombre_funcion),
          users (email_user, name_user)
        `)
                .order('purchase_date', { ascending: false })

            if (data) setSales(data)
            setLoading(false)
        }

        loadSales()
    }, [supabase])

    if (loading) return <div>Cargando ventas...</div>

    return (
        <div>
            <h1 className={styles.sectionTitle}>Registro de Ventas</h1>

            <div style={{ background: 'white', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Cliente</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Función</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Cant.</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '1rem' }}>
                                    {new Date(sale.purchase_date).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>{sale.users?.name_user || 'Anon'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{sale.users?.email_user}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {sale.theatre_functions?.nombre_funcion}
                                </td>
                                <td style={{ padding: '1rem' }}>{sale.quantity}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                    ${sale.total_price}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.85rem',
                                        background: sale.status === 'completed' ? '#d1fae5' : '#fee2e2',
                                        color: sale.status === 'completed' ? '#065f46' : '#991b1b'
                                    }}>
                                        {sale.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
