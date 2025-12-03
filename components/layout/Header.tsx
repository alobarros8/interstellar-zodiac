/**
 * Componente Header - Encabezado principal de la aplicación
 * Contiene el nombre del teatro, navegación y barra de búsqueda
 * 
 * TODO: Actualiza el nombre del teatro en la constante THEATER_NAME
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import styles from './Header.module.css'

// TODO: Cambia este nombre por el nombre real de tu teatro
const THEATER_NAME = 'Teatro Estrella'

/**
 * Componente principal del header
 * Incluye navegación responsive con menú móvil, autenticación y búsqueda
 */
export default function Header() {
    const [user, setUser] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    /**
     * Verifica si hay un usuario autenticado al montar el componente
     */
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)

            if (session?.user) {
                const { data } = await supabase
                    .from('users')
                    .select('role')
                    .eq('user_id', session.user.id)
                    .single()
                setUserRole(data?.role || null)
            }
        }
        checkUser()

        // Escucha cambios en el estado de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                const { data } = await supabase
                    .from('users')
                    .select('role')
                    .eq('user_id', session.user.id)
                    .single()
                setUserRole(data?.role || null)
            } else {
                setUserRole(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    /**
     * Maneja el cierre de sesión del usuario
     */
    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUserRole(null)
        router.push('/')
        router.refresh()
    }

    /**
     * Alterna el menú móvil
     */
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo y nombre del teatro */}
                <Link href="/" className={styles.logo}>
                    <h1 className={styles.theaterName}>{THEATER_NAME}</h1>
                </Link>

                {/* Botón de menú móvil */}
                <button
                    className={styles.menuButton}
                    onClick={toggleMenu}
                    aria-label="Abrir menú"
                >
                    <span className={styles.menuIcon}></span>
                    <span className={styles.menuIcon}></span>
                    <span className={styles.menuIcon}></span>
                </button>

                {/* Navegación desktop y móvil */}
                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList}>
                        <li>
                            <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link href="/funciones" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                Funciones
                            </Link>
                        </li>
                        <li>
                            <Link href="/contacto" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                Contacto
                            </Link>
                        </li>
                    </ul>

                    {/* Barra de búsqueda */}
                    <div className={styles.searchWrapper}>
                        <SearchBar />
                    </div>

                    {/* Botones de autenticación */}
                    <div className={styles.authButtons}>
                        {user ? (
                            <div className={styles.userMenu}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {user.user_metadata?.name || user.email}
                                    </span>
                                    <div className={styles.userLinks}>
                                        {userRole === 'admin' && (
                                            <Link href="/admin" className={styles.userLink} style={{ color: '#dc2626', fontWeight: 'bold' }} onClick={() => setIsMenuOpen(false)}>
                                                Panel Admin
                                            </Link>
                                        )}
                                        <Link href="/perfil" className={styles.userLink} onClick={() => setIsMenuOpen(false)}>
                                            Perfil
                                        </Link>
                                        <Link href="/historial" className={styles.userLink} onClick={() => setIsMenuOpen(false)}>
                                            Mis Compras
                                        </Link>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className={styles.btnSecondary}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className={styles.btnSecondary} onClick={() => setIsMenuOpen(false)}>
                                    Iniciar Sesión
                                </Link>
                                <Link href="/register" className={styles.btnPrimary} onClick={() => setIsMenuOpen(false)}>
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
