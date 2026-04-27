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

const DEFAULT_LAT = 41.3874;   // Barcelona as fallback
const DEFAULT_LNG = 2.1686;
const DEFAULT_RADIUS = 40;
const MIN_RADIUS = 5;
const MAX_RADIUS = 200;

export default function LocationPicker({
    defaultLocation,
    defaultRadius = DEFAULT_RADIUS,
    onChange,
}: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<any>(null);       // L instance
    const mapInstanceRef = useRef<any>(null);   // map instance
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);

    const [radius, setRadius] = useState(defaultRadius);
    const [coords, setCoords] = useState({
        lat: defaultLocation?.lat ?? DEFAULT_LAT,
        lng: defaultLocation?.lng ?? DEFAULT_LNG,
    });
    const [locationName, setLocationName] = useState<string | null>(null);

    /* Reverse geocode to show a human-readable location name */
    function reverseGeocode(lat: number, lng: number) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(r => r.json())
            .then(data => {
                const addr = data.address;
                const name =
                    addr.city || addr.town || addr.village || addr.county ||
                    addr.state || addr.country || `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
                setLocationName(name);
            })
            .catch(() => setLocationName(`${lat.toFixed(3)}, ${lng.toFixed(3)}`));
    }

    /* Bootstrap Leaflet once on mount */
    useEffect(() => {
        if (typeof window === 'undefined' || mapInstanceRef.current) return;

        // Dynamically import Leaflet so it's client-only
        import('leaflet').then(L => {
            leafletRef.current = L;

            // Fix default marker icon path broken by webpack
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            if (!mapRef.current) return;

            const map = L.map(mapRef.current, { zoomControl: true }).setView(
                [coords.lat, coords.lng], 9
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            const marker = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);
            const circle = L.circle([coords.lat, coords.lng], {
                radius: defaultRadius * 1000,
                color: '#3a6b35',
                fillColor: '#3a6b35',
                fillOpacity: 0.12,
                weight: 2,
            }).addTo(map);

            markerRef.current = marker;
            circleRef.current = circle;
            mapInstanceRef.current = map;

            // Drag marker → update state
            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                circle.setLatLng(pos);
                setCoords({ lat: pos.lat, lng: pos.lng });
                reverseGeocode(pos.lat, pos.lng);
            });

            // Click map → move marker
            map.on('click', (e: any) => {
                marker.setLatLng(e.latlng);
                circle.setLatLng(e.latlng);
                setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
                reverseGeocode(e.latlng.lat, e.latlng.lng);
            });

            // Try to centre on user's location
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

        // Inject Leaflet CSS if not already present
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* Keep circle in sync when radius slider changes */
    useEffect(() => {
        circleRef.current?.setRadius(radius * 1000);
    }, [radius]);

    /* Notify parent whenever coords or radius change */
    useEffect(() => {
        onChange({ lat: coords.lat, lng: coords.lng, radius });
    }, [coords, radius]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(e.target.value));
    };

    return (
        <div className="location-picker">
            {/* Map */}
            <div ref={mapRef} className="location-picker__map" />

            {/* Location name + hint */}
            <p className="location-picker__hint">
                {locationName
                    ? <>📍 <strong>{locationName}</strong> — fes clic al mapa o arrossega el marcador per canviar</>
                    : 'Carregant ubicació...'}
            </p>

            {/* Radius slider */}
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
                    onChange={handleRadius}
                />
                <span className="location-picker__radius-value">{radius} km</span>
            </div>
        </div>
    );
}
