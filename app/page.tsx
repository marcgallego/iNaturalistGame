import Link from 'next/link'
import '@/app/globals.css'

export default function Home() {
  return (
    <div className="form-page" style={{ flexDirection: 'column', justifyContent: 'center', gap: '3rem' }}>

      <div style={{ textAlign: 'center', animation: 'fadeSlideUp 0.4s ease both' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.2,
          marginBottom: '0.75rem',
        }}>
          Benvingut, estàs preparat?
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--color-muted)',
          maxWidth: '36ch',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Identifica la fauna i la flora del teu entorn!
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        width: '100%',
        maxWidth: '400px',
        animation: 'fadeSlideUp 0.4s ease 0.08s both',
      }}>
        <Link href="/explore/1" className="form-submit" style={{ fontSize: '1rem', padding: '0.875rem 1.5rem' }}>
          🌿 Explora la taxonomia de iNaturalist
        </Link>
        <Link href="/new_test" className="form-submit" style={{
          fontSize: '1rem',
          padding: '0.875rem 1.5rem',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
          boxShadow: 'none',
        }}>
          🧠 Posa a prova els teus coneixements!
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.625rem',
        fontSize: '0.8125rem',
        color: 'var(--color-muted)',
      }}>
        <span>Desenvolupat per Fernando Gastón</span>
        <a href="https://www.linkedin.com/in/fernando-gaston/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
          style={{ color: 'var(--color-muted)', transition: 'color 0.15s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.521-1.248-1.342-1.248-.822 0-1.358.54-1.358 1.248 0 .694.52 1.248 1.327 1.248h.015zm4.908 8.212h2.4V9.359c0-.215.016-.43.08-.584.175-.43.574-.877 1.244-.877.877 0 1.228.662 1.228 1.634v3.862h2.4V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.015a5.6 5.6 0 0 1 .015-.025V6.169h-2.4c.03.7 0 7.225 0 7.225z" />
          </svg>
        </a>
        <a href="https://github.com/fernando-gaston" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
          style={{ color: 'var(--color-muted)', transition: 'color 0.15s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>

    </div>
  );
}