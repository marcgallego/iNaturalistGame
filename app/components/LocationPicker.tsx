"use client"

import { useEffect, useRef, useState } from 'react'

export interface Location {
    lat: number;
    lng: number;
    radius: number; // km
}

interface Props {
    defaultLocation?: { lat: number; lng: number };
    defaultRadius?: number;
    onChange: (loc: Location) => void;
}

const DEFAULT_LAT = 41.3874;
const DEFAULT_LNG = 2.1686;
const DEFAULT_RADIUS = 40;
const MIN_RADIUS = 5;
const MAX_RADIUS = 200;

export default function LocationPicker({
    defaultLocation,
    defaultRadius = DEFAULT_RADIUS,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(o => {
            const next = !o;
            if (next) {
                // Wait for the CSS transition (250ms) to finish, then tell
                // Leaflet the container has its final size so it fills tiles correctly
                setTimeout(() => {
                    mapInstanceRef.current?.invalidateSize();
                }, 260);
            }
            return next;
        });
    }

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);

    const [radius, setRadius] = useState(defaultRadius);
    const [coords, setCoords] = useState({
        lat: defaultLocation?.lat ?? DEFAULT_LAT,
        lng: defaultLocation?.lng ?? DEFAULT_LNG,
    });
    const [locationName, setLocationName] = useState<string | null>(null);

    function reverseGeocode(lat: number, lng: number) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(r => r.json())
            .then(data => {
                const addr = data.address;
                setLocationName(
                    addr.city || addr.town || addr.village || addr.county ||
                    addr.state || addr.country || `${lat.toFixed(3)}, ${lng.toFixed(3)}`
                );
            })
            .catch(() => setLocationName(`${lat.toFixed(3)}, ${lng.toFixed(3)}`));
    }

    /* Inject Leaflet CSS once */
    useEffect(() => {
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
    }, []);

    /* Bootstrap Leaflet — only after the panel is open and the div is visible */
    useEffect(() => {
        if (!open || mapInstanceRef.current || !mapRef.current) return;

        import('leaflet').then(L => {
            if (!mapRef.current || mapInstanceRef.current) return;

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const map = L.map(mapRef.current, { zoomControl: true })
                .setView([coords.lat, coords.lng], 9);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            const marker = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);
            const circle = L.circle([coords.lat, coords.lng], {
                radius: radius * 1000,
                color: '#3a6b35',
                fillColor: '#3a6b35',
                fillOpacity: 0.12,
                weight: 2,
            }).addTo(map);

            markerRef.current = marker;
            circleRef.current = circle;
            mapInstanceRef.current = map;

            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                circle.setLatLng(pos);
                setCoords({ lat: pos.lat, lng: pos.lng });
                reverseGeocode(pos.lat, pos.lng);
            });

            map.on('click', (e: any) => {
                marker.setLatLng(e.latlng);
                circle.setLatLng(e.latlng);
                setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
                reverseGeocode(e.latlng.lat, e.latlng.lng);
            });

            if (navigator.geolocation && !defaultLocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    map.setView([lat, lng], 9);
                    marker.setLatLng([lat, lng]);
                    circle.setLatLng([lat, lng]);
                    setCoords({ lat, lng });
                    reverseGeocode(lat, lng);
                }, () => reverseGeocode(coords.lat, coords.lng));
            } else {
                reverseGeocode(coords.lat, coords.lng);
            }
        });

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        circleRef.current?.setRadius(radius * 1000);
    }, [radius]);

    useEffect(() => {
        onChange({ lat: coords.lat, lng: coords.lng, radius });
    }, [coords, radius]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="location-picker">
            {/* Toggle button */}
            <button
                type="button"
                className="location-picker__toggle"
                onClick={() => toggleOpen()}
                aria-expanded={open}
            >
                <span className="location-picker__toggle-icon">
                    {/* Pin icon */}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </span>
                <span className="location-picker__toggle-label">
                    {locationName
                        ? <>Zona: <strong>{locationName}</strong>, {radius} km</>
                        : 'Filtra per zona geogràfica'
                    }
                </span>
                {/* Chevron */}
                <span
                    className="location-picker__chevron"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {/* Collapsible panel */}
            <div className={`location-picker__panel${open ? ' location-picker__panel--open' : ''}`}>
                <div className="location-picker__panel-inner">
                    <div ref={mapRef} className="location-picker__map" />

                    <p className="location-picker__hint">
                        {locationName
                            ? <>📍 <strong>{locationName}</strong> — fes clic al mapa o arrossega el marcador per canviar</>
                            : 'Carregant ubicació...'}
                    </p>

                    <div className="location-picker__radius-row">
                        <label className="location-picker__radius-label" htmlFor="radius-slider">
                            Radi
                        </label>
                        <input
                            id="radius-slider"
                            className="location-picker__slider"
                            type="range"
                            min={MIN_RADIUS}
                            max={MAX_RADIUS}
                            step="5"
                            value={radius}
                            onChange={e => setRadius(Number(e.target.value))}
                        />
                        <span className="location-picker__radius-value">{radius} km</span>
                    </div>
                </div>
            </div>
        </div>
    );
}