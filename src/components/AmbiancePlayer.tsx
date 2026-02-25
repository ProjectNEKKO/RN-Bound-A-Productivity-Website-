"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronRight, Zap, Flower2, Palette, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRACKS = [
    { id: 'midnight-coffee', name: 'Midnight Coffee', artist: 'Lo-fi Dreams', listeners: '42k listening', file: '/audio/rain.mp3', heroImg: '/images/hero-midnight-coffee.png' },
    { id: 'rain', name: 'Rainy Day', artist: 'Ambient Sounds', listeners: '28k listening', file: '/audio/rain.mp3', heroImg: null },
    { id: 'cafe', name: 'Coffee Shop', artist: 'City Ambience', listeners: '35k listening', file: '/audio/cafe.mp3', heroImg: null },
    { id: 'nature', name: 'Nature Walk', artist: 'Outdoor Sounds', listeners: '19k listening', file: '/audio/nature.mp3', heroImg: null },
];

const PLAYLISTS = [
    { name: 'Deep Work', desc: 'Ultimate focus engine', gradient: 'from-emerald-500 via-emerald-700 to-teal-900', emoji: '🧠', trackIdx: 0 },
    { name: 'Coffee Shop', desc: 'Bustling morning vibes', gradient: 'from-amber-400 via-orange-500 to-amber-800', emoji: '☕', trackIdx: 2 },
    { name: 'Rainy Day', desc: 'Cozy pitter-patter', gradient: 'from-sky-400 via-blue-600 to-indigo-900', emoji: '🌧️', trackIdx: 1 },
    { name: 'Nature Walk', desc: 'Birds and soft breeze', gradient: 'from-lime-400 via-green-600 to-emerald-900', emoji: '🌿', trackIdx: 3 },
    { name: 'Ocean Waves', desc: 'Calm shoreline retreat', gradient: 'from-cyan-300 via-blue-500 to-blue-900', emoji: '🌊', trackIdx: 1 },
];

const MOODS = [
    { label: 'Focus', Icon: Zap },
    { label: 'Relax', Icon: Flower2 },
    { label: 'Create', Icon: Palette },
    { label: 'Meditate', Icon: Heart },
];

export function AmbiancePlayer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeTrack = TRACKS[activeIndex];

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);
    const [activeMood, setActiveMood] = useState<string | null>('Focus');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(activeTrack.file);
            audioRef.current.loop = true;
        }
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        const wasPlaying = isPlaying;
        if (wasPlaying) {
            audioRef.current.pause();
        }

        audioRef.current.src = activeTrack.file;
        audioRef.current.load();

        if (wasPlaying) {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    }, [activeTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Progress simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 0.5));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Failed to play audio:", e));
        }
    };

    const nextTrack = () => {
        setActiveIndex((prev) => (prev + 1) % TRACKS.length);
        setProgress(0);
    };

    const prevTrack = () => {
        setActiveIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setProgress(0);
    };

    return (
        <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Focus & Chill</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Hero card */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Hero */}
                            <div className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer"
                                onClick={togglePlay}
                            >
                                {/* Background Image or Gradient */}
                                {activeTrack.heroImg ? (
                                    <img
                                        src={activeTrack.heroImg}
                                        alt={activeTrack.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950" />
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Animated pulse when playing */}
                                {isPlaying && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                        </span>
                                        <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Now Playing</span>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                                    <div>
                                        <span className="inline-block px-2.5 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-md mb-2 tracking-wider">
                                            Trending Now
                                        </span>
                                        <h2 className="text-3xl font-bold text-white drop-shadow-lg">{activeTrack.name}</h2>
                                        <p className="text-sm text-white/70 mt-0.5">{activeTrack.artist} · {activeTrack.listeners}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                        className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:scale-110 hover:shadow-xl transition-all"
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-0.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center gap-3 px-1">
                                <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                                    {Math.floor(progress * 0.04)}:{((progress * 2.4) % 60).toFixed(0).padStart(2, '0')}
                                </span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium tabular-nums">3:45</span>
                            </div>
                        </div>

                        {/* Right: Daily Flow + Mood */}
                        <div className="space-y-6">
                            {/* Your Daily Flow */}
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-primary text-lg">✨</span>
                                    <h3 className="text-sm font-semibold text-foreground">Your Daily Flow</h3>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">Tailored for your focus today.</p>

                                {/* Emoji avatar stack */}
                                <div className="flex -space-x-2 mb-5">
                                    {["🌿", "☕", "🎵", "🌊"].map((emoji, i) => (
                                        <div key={i} className="size-9 rounded-full border-2 border-card flex items-center justify-center text-sm bg-muted">
                                            {emoji}
                                        </div>
                                    ))}
                                    <div className="size-9 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold bg-primary text-white">
                                        +
                                    </div>
                                </div>

                                {/* Mood buttons */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-muted-foreground text-xs">🎛️</span>
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Set your mood</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {MOODS.map((mood) => {
                                        const isActive = activeMood === mood.label;
                                        return (
                                            <button
                                                key={mood.label}
                                                onClick={() => setActiveMood(isActive ? null : mood.label)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                                                    isActive
                                                        ? "bg-primary/10 border border-primary/30 text-primary shadow-sm"
                                                        : "bg-card border border-border text-foreground hover:border-primary/20 hover:bg-primary/5"
                                                )}
                                            >
                                                <mood.Icon size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
                                                {mood.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curated Playlists */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-foreground">Curated Playlists</h2>
                            <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-colors">
                                View all <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {PLAYLISTS.map((playlist, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setActiveIndex(playlist.trackIdx); setProgress(0); }}
                                    className="group text-left"
                                >
                                    <div className={cn(
                                        "aspect-square rounded-2xl overflow-hidden mb-2 relative",
                                        "bg-gradient-to-br",
                                        playlist.gradient
                                    )}>
                                        {/* Emoji overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30 group-hover:opacity-50 transition-opacity duration-300">
                                            {playlist.emoji}
                                        </div>

                                        {/* Hover play indicator */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30">
                                            <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <Play size={20} className="fill-current ml-0.5" />
                                            </div>
                                        </div>

                                        {/* Bottom label */}
                                        <div className="absolute bottom-2 left-2 right-2">
                                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
                                                {playlist.desc.split(' ')[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="text-xs font-semibold text-foreground truncate">{playlist.name}</h4>
                                    <p className="text-[10px] text-muted-foreground truncate">{playlist.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Persistent Player Bar */}
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border px-6 py-3 flex items-center gap-6">
                {/* Track info */}
                <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="size-10 rounded-lg overflow-hidden bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center flex-shrink-0">
                        {activeTrack.heroImg ? (
                            <img src={activeTrack.heroImg} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-sm">🎵</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{activeTrack.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{activeTrack.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 flex-1 justify-center">
                    <button
                        onClick={prevTrack}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Previous Ambiance"
                    >
                        <SkipBack size={18} className="fill-current" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="size-10 bg-primary rounded-full flex items-center justify-center text-white hover:scale-105 transition-all shadow-md shadow-primary/20"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
                    </button>

                    <button
                        onClick={nextTrack}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Next Ambiance"
                    >
                        <SkipForward size={18} className="fill-current" />
                    </button>
                </div>

                {/* Progress + Volume */}
                <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Volume2 size={14} className="text-muted-foreground" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                            aria-label="Volume Control"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
