"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { returnName } from '@/app/utils'

/* ── Types ───────────────────────────────────────────────── */
interface TaxonData {
    taxon_name: string;
    parent_id: number | null;
    image: { url: string; attribution: string } | null;
}

interface ChildTaxon {
    id: number;
    name: string;
}

/* ── Data helpers ────────────────────────────────────────── */
function parseTaxon(json: any): TaxonData {
    const result = json["results"][0];
    return {
        taxon_name: returnName(result),
        parent_id: result["parent_id"] ?? null,
        image: result["default_photo"] ?? null,
    };
}

function parseChildren(json: any): ChildTaxon[] {
    const n = Math.min(json["total_results"], json["per_page"]);
    return Array.from({ length: n }, (_, i) => ({
        id: json["results"][i]["id"],
        name: returnName(json["results"][i]),
    }));
}

/* ── Sub-components ──────────────────────────────────────── */
function CardSkeleton() {
    return (
        <div className="taxa-card" aria-busy="true" aria-label="Loading taxon">
            <div className="skeleton w-48 h-7 mb-3 mx-auto" />
            <div className="skeleton w-28 h-4 mb-5 mx-auto" />
            <div className="skeleton w-32 h-9 mb-5 rounded-lg" />
            <div className="skeleton w-full h-64 rounded-xl mb-3" />
            <div className="skeleton w-40 h-3 mx-auto" />
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <aside className="taxa-sidebar" aria-busy="true">
            <div className="skeleton w-24 h-5 mb-4" />
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="skeleton w-full h-8 mb-2 rounded-lg" />
            ))}
        </aside>
    );
}

function TaxonCard({ taxonId, data }: { taxonId: string; data: TaxonData }) {
    const imageUrl = data.image?.url.replace("square", "original");

    return (
        <article className="taxa-card">
            <h1 className="taxa-card__title">{data.taxon_name}</h1>

            {data.parent_id && (
                <Link
                    href={`/explore/${data.parent_id}`}
                    className="taxa-card__parent-link"
                >
                    ← Ves al taxó pare
                </Link>
            )}

            <Link href={`/new_test/${taxonId}`} className="taxa-card__cta">
                Fes un test d'aquest taxó
            </Link>

            <figure className="w-full text-center">
                {imageUrl ? (
                    <div className="taxa-card__image-wrap">
                        <img
                            className="taxa-card__image"
                            src={imageUrl}
                            alt={`${data.taxon_name} image`}
                        />
                    </div>
                ) : (
                    <div className="taxa-card__no-image">
                        Sense imatge disponible
                    </div>
                )}
                {data.image && (
                    <figcaption className="taxa-card__attribution">
                        {data.image.attribution}
                    </figcaption>
                )}
            </figure>
        </article>
    );
}

function TaxonSidebar({ taxa }: { taxa: ChildTaxon[] }) {
    return (
        <aside className="taxa-sidebar">
            <h2 className="taxa-sidebar__title">Subtaxons</h2>
            <div className="taxa-sidebar__scroll">
                {taxa.length === 0 ? (
                    <p className="text-sm italic" style={{ color: 'var(--color-muted)' }}>
                        Sense subtaxons
                    </p>
                ) : (
                    <nav aria-label="Child taxa">
                        {taxa.map(child => (
                            <Link
                                key={child.id}
                                href={`/explore/${child.id}`}
                                className="taxa-sidebar__item block"
                            >
                                {child.name}
                                <span className="taxa-sidebar__id">({child.id})</span>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </aside>
    );
}

/* ── Page ────────────────────────────────────────────────── */
export default function Taxonomy({ params }: { params: Promise<{ taxon_id: string }> }) {
    const [taxonId, setTaxonId] = useState<string | null>(null);
    const [data, setData] = useState<TaxonData | null>(null);
    const [children, setChildren] = useState<ChildTaxon[] | null>(null);

    /* Resolve params */
    useEffect(() => {
        params.then(resolved => {
            const id = resolved.taxon_id;
            setTaxonId(/^\+?(0|[1-9]\d*)$/.test(id) ? id : "1");
        });
    }, [params]);

    /* Fetch taxon info */
    useEffect(() => {
        if (!taxonId) return;
        fetch(`https://api.inaturalist.org/v1/taxa?id=${taxonId}&per_page=1&locale=ca`)
            .then(r => r.json())
            .then(json => setData(parseTaxon(json)))
            .catch(console.error);
    }, [taxonId]);

    /* Fetch children */
    useEffect(() => {
        if (!taxonId) return;
        fetch(`https://api.inaturalist.org/v1/taxa?parent_id=${taxonId}&per_page=200&locale=ca`)
            .then(r => r.json())
            .then(json => setChildren(parseChildren(json)))
            .catch(console.error);
    }, [taxonId]);

    return (
        <div className="taxa-page">
            <div className="taxa-layout">
                {data && taxonId
                    ? <TaxonCard taxonId={taxonId} data={data} />
                    : <CardSkeleton />
                }
                {children !== null
                    ? <TaxonSidebar taxa={children} />
                    : <SidebarSkeleton />
                }
            </div>
        </div>
    );
}