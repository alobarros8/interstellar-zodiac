/**
 * Página de Inicio (Home)
 * Incluye hero/banner, funciones destacadas e información del teatro
 * 
 * TODO: Actualizar la información del teatro en TheaterInfo
 */

import FeaturedShows from '@/components/home/FeaturedShows'
import TheaterInfo from '@/components/home/TheaterInfo'
import styles from './page.module.css'

/**
 * Componente principal de la página de inicio
 */
export default function HomePage() {
  return (
    <div className={styles.homePage}>
      {/* Hero / Banner de bienvenida */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Bienvenidos al <span className={styles.gradientText}>Teatro Estrella</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Vive la magia del teatro con las mejores funciones en cartelera. Compra tus entradas de forma rápida y segura.
          </p>
          <div className={styles.heroButtons}>
            <a href="/funciones" className={styles.btnPrimary}>
              Ver Funciones
            </a>
            <a href="/contacto" className={styles.btnSecondary}>
              Contactar
            </a>
          </div>
        </div>
        <div className={styles.heroPattern}></div>
      </section>

      {/* Funciones destacadas */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Funciones Destacadas</h2>
            <p className={styles.sectionSubtitle}>
              Las mejores obras de nuestra cartelera
            </p>
          </div>
          <FeaturedShows />
        </div>
      </section>

      {/* Información del teatro */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <TheaterInfo />
        </div>
      </section>
    </div>
  )
}
