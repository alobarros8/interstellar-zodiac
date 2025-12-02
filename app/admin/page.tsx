/**
 * Dashboard Principal de Administración
 * Muestra resumen de ventas y estadísticas
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './admin.module.css'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalFunctions: 0
    })
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadStats() {
            // 1. Cargar ventas totales
            const { data: purchases } = await supabase
                .from('purchases')
                .select('total_price')

            const totalSales = purchases?.reduce((sum, p) => sum + p.total_price, 0) || 0
            const totalOrders = purchases?.length || 0

            // 2. Cargar cantidad de funciones
            const { count } = await supabase
                .from('theatre_functions')
                .select('*', { count: 'exact', head: true })

            setStats({
                totalSales,
                totalOrders,
                totalFunctions: count || 0
            })
            setLoading(false)
        }

        loadStats()
    }, [supabase])

    if (loading) return <div>Cargando estadísticas...</div>

    return (
        <div>
            <h1 className={styles.sectionTitle}>Dashboard</h1>

            <div className={styles.dashboardGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statTitle}>Ventas Totales</span>
                    <span className={styles.statValue}>
                        ${stats.totalSales.toLocaleString('es-AR')}
                    </span>
                    <span className={styles.statTrend}>+100% este mes</span>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statTitle}>Entradas Vendidas</span>
                    <span className={styles.statValue}>{stats.totalOrders}</span>
                    <span className={styles.statTrend}>Pedidos completados</span>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statTitle}>Funciones Activas</span>
                    <span className={styles.statValue}>{stats.totalFunctions}</span>
                    <span className={styles.statTrend}>En cartelera</span>
                </div>
            </div>

            {/* Aquí podríamos agregar una gráfica o tabla de últimas ventas */}
        </div>
    )
}
