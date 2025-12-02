/**
 * Componente TheaterInfo
 * Muestra información del teatro: ubicación, redes sociales, historia
 * 
 * TODO: Actualiza las siguientes constantes con la información real de tu teatro:
 * - THEATER_ADDRESS
 * - THEATER_PHONE
 * - THEATER_EMAIL
 * - SOCIAL_MEDIA (links de redes sociales)
 * - THEATER_HISTORY
 */

import styles from './TheaterInfo.module.css'

// TODO: Actualiza esta información con los datos reales de tu teatro
const THEATER_ADDRESS = 'Av. Corrientes 1234, Buenos Aires, Argentina'
const THEATER_PHONE = '+54 11 1234-5678'
const THEATER_EMAIL = 'contacto@teatroestrella.com'
const SOCIAL_MEDIA = {
    facebook: 'https://facebook.com/teatroestrella',
    instagram: 'https://instagram.com/teatroestrella',
    twitter: 'https://twitter.com/teatroestrella',
}
const THEATER_HISTORY = `
  Teatro Estrella es un espacio cultural dedicado a las artes escénicas desde hace más de 50 años. 
  Ubicado en el corazón de la ciudad, nuestro teatro ha sido testigo de innumerables presentaciones 
  que han marcado la historia cultural de nuestra comunidad. Nos enorgullece ofrecer una 
  programación diversa que incluye obras clásicas y contemporáneas, brindando a nuestro público 
  experiencias artísticas únicas e inolvidables.
`

/**
 * Componente de información del teatro
 */
export default function TheaterInfo() {
    return (
        <div className={styles.theaterInfo}>
            <div className={styles.infoGrid}>
                {/* Ubicación */}
                <div className={styles.infoCard}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    </div>
                    <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>Ubicación</h3>
                        <p className={styles.infoText}>{THEATER_ADDRESS}</p>
                    </div>
                </div>

                {/* Contacto */}
                <div className={styles.infoCard}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                    </div>
                    <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>Contacto</h3>
                        <p className={styles.infoText}>{THEATER_PHONE}</p>
                        <p className={styles.infoText}>{THEATER_EMAIL}</p>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div className={styles.infoCard}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </div>
                    <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>Redes Sociales</h3>
                        <div className={styles.socialLinks}>
                            <a href={SOCIAL_MEDIA.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                Facebook
                            </a>
                            <a href={SOCIAL_MEDIA.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                Instagram
                            </a>
                            <a href={SOCIAL_MEDIA.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historia */}
            <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>Nuestra Historia</h3>
                <p className={styles.historyText}>{THEATER_HISTORY}</p>
            </div>
        </div>
    )
}
