"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { returnName } from '@/app/utils'
import LocationPicker, { type Location } from '@/app/components/LocationPicker'

const DEFAULT_LOCATION: Location = { lat: 41.3874, lng: 2.1686, radius: 40 };

export default function TestForm({ params }: { params: Promise<{ taxon_id: string }> }) {
    const [mode, setMode] = useState<string | null>(null);
    const [taxonName, setTaxonName] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState<number | null>(null);
    const [numSpecies, setNumSpecies] = useState<number | null>(null);
    const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);

    useEffect(() => {
        params.then(resolved => {
            setMode(/^\+?(0|[1-9]\d*)$/.test(resolved.taxon_id) ? resolved.taxon_id : "1");
        });
    }, [params]);

    useEffect(() => {
        if (!mode) return;
        fetch(`https://api.inaturalist.org/v1/taxa?id=${mode}&locale=ca&per_page=1`)
            .then(r => r.json())
            .then(json => setTaxonName(returnName(json["results"][0])))
            .catch(console.error);
    }, [mode]);

    const href = `/test?taxon_id=${mode}&num_questions=${numQuestions}&num_species=${numSpecies}`
        + `&lat=${location.lat.toFixed(5)}&lng=${location.lng.toFixed(5)}&radius=${location.radius}`;

    return (
        <div className="form-page">
            <div className="form-wrap" style={{ maxWidth: 520 }}>

                <h1 className="form-title">
                    Nou joc:{' '}
                    {taxonName
                        ? <span className="form-title__accent">{taxonName}</span>
                        : <span className="skeleton" style={{ display: 'inline-block', width: '8rem', height: '1.75rem', verticalAlign: 'middle', borderRadius: '0.5rem' }} />
                    }
                </h1>

                <div className="form-card">

                    <div className="form-field">
                        <label className="form-label" htmlFor="num_questions">
                            Número de preguntes
                        </label>
                        <input
                            className="form-input"
                            id="num_questions"
                            type="number"
                            min="1"
                            max="20"
                            step="1"
                            placeholder="Entre 1 i 20"
                            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="num_species">
                            Número d'espècies
                        </label>
                        <input
                            className="form-input"
                            id="num_species"
                            type="number"
                            min="2"
                            max="100"
                            step="1"
                            placeholder="Entre 2 i 100"
                            onChange={(e) => setNumSpecies(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Zona geogràfica</label>
                        <LocationPicker
                            defaultRadius={40}
                            onChange={setLocation}
                        />
                    </div>

                    <hr className="form-divider" />

                    <Link className="form-submit" href={href}>
                        Comença
                    </Link>

                </div>

                <div className="form-hint">
                    Selecciona la zona geogràfica, el nombre de preguntes i el nombre d'espècies:
                    quantes més espècies escullis més difícil serà!
                </div>

            </div>
        </div>
    );
}
