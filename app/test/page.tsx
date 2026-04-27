"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { returnName } from '@/app/utils'

/* ── Types ───────────────────────────────────────────────── */
type PhotoInfo = { url: string; attribution?: string };

type Species = { id: number; observations_count: number; [key: string]: any };

interface QuestionState {
    url: PhotoInfo | null;
    species: Species[] | null;
    correct: number | null;
}

interface AnsweredQuestion {
    question: QuestionState;
    userResponse: number;
    isCorrect: boolean;
}

/* ── Helpers ─────────────────────────────────────────────── */
function filterZeros(arr: Species[]): Species[] {
    let n = 1;
    while (n < arr.length && arr[n].observations_count > 0) n++;
    return arr.slice(0, n);
}

function getRandomCombination<T>(arr: T[], k: number): T[] {
    const tmp = [...arr];
    const out: T[] = [];
    for (let i = 0; i < k; i++) {
        const idx = Math.floor(Math.random() * tmp.length);
        out.push(tmp[idx]);
        tmp.splice(idx, 1);
    }
    return out;
}

/* ── Question component ──────────────────────────────────── */
function Question({
    taxonName,
    question,
    questionIndex,
    numQuestions,
    handleAnswer,
}: {
    taxonName: string;
    question: QuestionState;
    questionIndex: number;
    numQuestions: number;
    handleAnswer: (userResponse: number) => void;
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    if (!question.url) {
        return (
            <div className="quiz-page">
                <div className="quiz-card" style={{ maxWidth: 480, padding: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-muted)' }}>No hi ha dades per a aquest taxó.</p>
                </div>
            </div>
        );
    }

    const imageUrl = question.url.url.replace("square", "original");

    return (
        <div className="quiz-page">
            {/* Lightbox */}
            <dialog
                ref={dialogRef}
                onClick={() => dialogRef.current?.close()}
                style={{
                    width: '90vw',
                    maxWidth: '900px',
                    padding: 0,
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: 'transparent',
                }}
                className="backdrop:bg-black/80"
            >
                <img
                    src={imageUrl}
                    alt="Species"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.75rem' }}
                />
            </dialog>

            <div className="quiz-card">
                {/* Header */}
                <div className="quiz-card__header">
                    <h1 className="quiz-card__title">{taxonName}</h1>
                    <span className="quiz-card__progress">
                        {questionIndex + 1} / {numQuestions}
                    </span>
                </div>

                {/* Body: image left + options right */}
                <div className="quiz-card__body">
                    <button
                        className="quiz-card__image-wrap"
                        onClick={() => dialogRef.current?.showModal()}
                        aria-label="Ampliar imatge"
                    >
                        <img
                            src={imageUrl}
                            alt="De quina espècie és aquesta foto?"
                            className="quiz-card__image"
                        />
                        <span className="quiz-card__zoom-hint">🔍 Ampliar</span>
                    </button>

                    <div className="quiz-card__options">
                        <p className="quiz-card__options-label">De quina espècie és?</p>
                        {question.species!.map((species, i) => (
                            <button
                                key={i}
                                className="quiz-btn"
                                onClick={() => handleAnswer(i)}
                            >
                                {returnName(species)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Attribution */}
                {question.url.attribution && (
                    <p className="quiz-card__attribution">{question.url.attribution}</p>
                )}
            </div>
        </div>
    );
}

/* ── Results component ───────────────────────────────────── */
function Results({
    points,
    numQuestions,
    answeredQuestions,
}: {
    points: number;
    numQuestions: number;
    answeredQuestions: AnsweredQuestion[];
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const pct = Math.round((points / numQuestions) * 100);

    return (
        <div className="results-page">
            {/* Lightbox */}
            <dialog
                ref={dialogRef}
                onClick={() => dialogRef.current?.close()}
                style={{
                    width: '90vw',
                    maxWidth: '900px',
                    padding: 0,
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: 'transparent',
                }}
                className="backdrop:bg-black/80"
            >
                {activeImage && (
                    <img
                        src={activeImage}
                        alt="Species"
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.75rem' }}
                    />
                )}
            </dialog>

            <div className="results-wrap">
                {/* Score summary */}
                <div className="results-score">
                    <h2 className="results-score__title">Test completat!</h2>
                    <p className="results-score__stat">
                        Has encertat{' '}
                        <span className="results-score__num">{points}</span>
                        {' '}de{' '}
                        <span className="results-score__num">{numQuestions}</span>
                        {' '}({pct}%)
                    </p>
                </div>

                {/* Action buttons */}
                <div className="results-actions">
                    <Link href="/new_test" className="results-btn results-btn--primary">
                        Fes un altre test
                    </Link>
                    <button
                        className="results-btn results-btn--secondary"
                        onClick={() => window.location.reload()}
                    >
                        Repeteix aquest test
                    </button>
                </div>

                {/* Answers grid */}
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    alignSelf: 'flex-start',
                }}>
                    Respostes
                </h3>

                <div className="results-grid">
                    {answeredQuestions.map((item, index) => {
                        const imgUrl = item.question.url!.url.replace("square", "original");
                        const correctName = returnName(item.question.species![item.question.correct!]);
                        const userAnswerName = returnName(item.question.species![item.userResponse]);
                        return (
                            <div key={index} className="results-item">
                                <div
                                    className="results-item__img-wrap"
                                    onClick={() => {
                                        setActiveImage(imgUrl);
                                        dialogRef.current?.showModal();
                                    }}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={correctName}
                                        className="results-item__img"
                                    />
                                    <span className={`results-item__badge ${item.isCorrect ? 'results-item__badge--correct' : 'results-item__badge--wrong'}`}>
                                        {item.isCorrect ? '✓' : '✗'}
                                    </span>
                                </div>
                                <div className="results-item__body">
                                    <p className="results-item__correct">{correctName}</p>
                                    {!item.isCorrect && (
                                        <>
                                            <p className="results-item__wrong-label">La teva resposta</p>
                                            <p className="results-item__wrong">{userAnswerName}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ── Main test logic ─────────────────────────────────────── */
function TestComponent() {
    const searchParams = useSearchParams();
    const taxon_id      = searchParams.get('taxon_id');
    const num_questions = searchParams.get('num_questions');
    const num_species   = searchParams.get('num_species');
    const lat_param     = searchParams.get('lat');
    const lng_param     = searchParams.get('lng');
    const radius_param  = searchParams.get('radius');

    const [taxonId, setTaxonId]           = useState<string | null>(null);
    const [taxonName, setTaxonName]       = useState<string>("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [numSpecies, setNumSpecies]     = useState(10);
    const [coords, setCoords]             = useState({ lat: 41.3874, lng: 2.1686, radius: 40 });

    const [data, setData]         = useState<{ total_results: number; results: Species[] } | null>(null);
    const [question, setQuestion] = useState<QuestionState | null>(null);
    const [questionIndex, setQuestionIndex] = useState(-1);   // -1 = not started
    const [points, setPoints]     = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);

    /* Resolve URL params */
    useEffect(() => {
        if (!taxon_id) return;
        setTaxonId(/^\+?(0|[1-9]\d*)$/.test(taxon_id) ? taxon_id : "1");
        setNumQuestions(num_questions ? parseInt(num_questions) : 5);
        setNumSpecies(num_species     ? parseInt(num_species)   : 10);
        setCoords({
            lat:    lat_param    ? parseFloat(lat_param)    : 41.3874,
            lng:    lng_param    ? parseFloat(lng_param)    : 2.1686,
            radius: radius_param ? parseInt(radius_param)   : 40,
        });
    }, [taxon_id, num_questions, num_species, lat_param, lng_param, radius_param]);

    /* Fetch taxon name */
    useEffect(() => {
        if (!taxonId) return;
        fetch(`https://api.inaturalist.org/v1/taxa?id=${taxonId}&locale=ca&per_page=1`)
            .then(r => r.json())
            .then(json => setTaxonName(returnName(json.results[0])))
            .catch(console.error);
    }, [taxonId]);

    /* Fetch species pool */
    useEffect(() => {
        if (!taxonId) return;
        fetch(`https://api.inaturalist.org/v1/observations/species_counts?taxon_id=${taxonId}&lat=${coords.lat}&lng=${coords.lng}&radius=${coords.radius}&per_page=${numSpecies}&locale=ca`)
            .then(r => r.json())
            .then(json => setData({
                total_results: json.total_results,
                results: json.results.map((r: any) => ({
                    ...r.taxon,
                    observations_count: r.count,
                })),
            }))
            .catch(console.error);
    }, [taxonId, numSpecies]);

    /* Generate a question */
    const generateQuestion = () => {
        if (!data) return;
        setQuestionIndex(i => i + 1);

        if (data.total_results === 0) {
            setQuestion({ url: null, species: null, correct: null });
            return;
        }

        const species  = filterZeros(data.results);
        const numOpts  = Math.min(species.length, 5);
        const options  = getRandomCombination(species, numOpts);
        const correctIdx = Math.floor(Math.random() * numOpts);

        fetch(`https://api.inaturalist.org/v1/observations?photo_license=cc-by-nc&taxon_id=${options[correctIdx].id}&quality_grade=research&order=desc&order_by=created_at`)
            .then(r => r.json())
            .then(json => {
                const obs = json.results[Math.floor(Math.random() * json.results.length)];
                setQuestion({
                    url:     obs.photos[0],
                    species: options,
                    correct: correctIdx,
                });
            })
            .catch(console.error);
    };

    /* Start when data arrives */
    useEffect(() => {
        if (data) generateQuestion();
    }, [data]);

    const handleAnswer = (userResponse: number) => {
        const isCorrect = question?.correct === userResponse;
        setPoints(p => p + (isCorrect ? 1 : 0));
        setAnsweredQuestions(prev => [...prev, { question: question!, userResponse, isCorrect }]);
        generateQuestion();
    };

    /* ── Render ── */
    if (questionIndex >= numQuestions) {
        return (
            <Results
                points={points}
                numQuestions={numQuestions}
                answeredQuestions={answeredQuestions}
            />
        );
    }

    if (!question) {
        return (
            <div className="quiz-page">
                <div className="skeleton" style={{ width: '100%', maxWidth: 900, height: 400, borderRadius: '1rem' }} />
            </div>
        );
    }

    return (
        <Question
            taxonName={taxonName}
            question={question}
            questionIndex={questionIndex}
            numQuestions={numQuestions}
            handleAnswer={handleAnswer}
        />
    );
}

export default function Test() {
    return (
        <Suspense fallback={
            <div className="quiz-page">
                <div className="skeleton" style={{ width: '100%', maxWidth: 900, height: 400, borderRadius: '1rem' }} />
            </div>
        }>
            <TestComponent />
        </Suspense>
    );
}
