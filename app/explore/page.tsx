import Link from 'next/link'

export default function Explore() {
    return (
        <div className="form-page">
            <div className="form-wrap">

                <h1 className="form-title">
                    Explora l'arbre taxonòmic
                </h1>

                <div className="form-card" style={{ gap: '1.5rem' }}>
                    <p style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-muted)',
                        lineHeight: 1.7,
                        textAlign: 'justify',
                    }}>
                        Amb aquesta funcionalitat pots estudiar les relacions taxonòmiques entre les diferents espècies
                        que trobaràs a iNaturalist. Des dels fongs fins els peixos passant per les aus i les algues, podràs
                        explorar els ordres, regnes, famílies, gèneres i espècies d'animals que hi ha a la plataforma.
                    </p>

                    <Link href="/explore/2" className="form-submit">
                        Comença pel principi: Animalia!
                    </Link>
                </div>

            </div>
        </div>
    );
}