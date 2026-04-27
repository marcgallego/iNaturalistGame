"use client"

import game_modes from '../game_modes.json'

import React, { useState } from 'react';
import Link from 'next/link'
import LocationPicker, { type Location } from '@/app/components/LocationPicker'

function getGameModeOptions() {
    return (Object.keys(game_modes) as Array<keyof typeof game_modes>).map(mode => (
        <option key={game_modes[mode]} value={game_modes[mode]}>
            {mode}
        </option>
    ));
}

const DEFAULT_LOCATION: Location = { lat: 41.3874, lng: 2.1686, radius: 40 };

export default function TestForm() {
    const [mode, setMode] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState<number | null>(null);
    const [numSpecies, setNumSpecies] = useState<number | null>(null);
    const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);

    const href = `/test?taxon_id=${mode}&num_questions=${numQuestions}&num_species=${numSpecies}`
        + `&lat=${location.lat.toFixed(5)}&lng=${location.lng.toFixed(5)}&radius=${location.radius}`;

    return (
        <div className="form-page">
            <div className="form-wrap" style={{ maxWidth: 520 }}>

                <h1 className="form-title">Nou joc</h1>

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
                        <label className="form-label" htmlFor="game_mode">
                            Mode de joc
                        </label>
                        <select
                            className="form-select"
                            id="game_mode"
                            onChange={(e) => setMode(e.target.value || null)}
                            value={mode || ""}
                        >
                            <option value="" disabled>Selecciona un mode de joc</option>
                            {getGameModeOptions()}
                        </select>
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
                    Aquí pots jugar a identificar espècies dels grups taxonòmics que més t'agradin.
                    Selecciona el nombre d'espècies que vols incloure al test: quantes més n'escullis
                    més difícil serà!{' '}
                    Si no trobes el que busques utilitza la pàgina{' '}
                    <Link href="/explore" className="form-hint__link">Explora</Link>
                    {' '}per seleccionar un test amb el grup que més t'interessi.
                </div>

            </div>
        </div>
    );
}
