/**
 * Layout para el Panel de Administración
 * Incluye navegación lateral y verificación de permisos
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import styles from './admin.module.css'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        async function checkAdmin() {
            console.log('Verificando permisos de admin...')
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                console.log('No hay usuario autenticado')
                router.push('/login')
                return
            }

            console.log('Usuario autenticado:', user.id)

            // Verificar rol en tabla users
            const { data: userData, error } = await supabase
                .from('users')
                .select('role')
                .eq('user_id', user.id)
                .single()

            console.log('Datos de usuario (DB):', userData)
            console.log('Error (DB):', error)

            if (error || !userData) {
                alert('Error: No se encontró tu usuario en la base de datos pública. Revisa la consola.')
                return
            }

            if (userData?.role !== 'admin') {
                alert(`Acceso denegado. Tu rol es: ${userData?.role || 'ninguno'}. Se requiere: admin`)
                // router.push('/') // Comentado para debug
                return
            }

            setIsAdmin(true)
            setLoading(false)
        }

        checkAdmin()
    }, [supabase, router])

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Verificando permisos...</p>
            </div>
        )
    }

    if (!isAdmin) return null

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Funciones', href: '/admin/funciones', icon: '🎭' },
        { name: 'Ventas', href: '/admin/ventas', icon: '💰' },
    ]

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Panel</h2>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>
                        ← Volver al sitio
                    </Link>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}
