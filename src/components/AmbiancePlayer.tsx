"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRACKS = [
    { id: 'midnight-coffee', name: 'Midnight Coffee', artist: 'Lo-fi Dreams', listeners: '42k listening', file: '/audio/rain.mp3', color: 'from-stone-700 to-stone-900' },
    { id: 'rain', name: 'Rainy Day', artist: 'Ambient Sounds', listeners: '28k listening', file: '/audio/rain.mp3', color: 'from-sky-700 to-sky-900' },
    { id: 'cafe', name: 'Coffee Shop', artist: 'City Ambience', listeners: '35k listening', file: '/audio/cafe.mp3', color: 'from-amber-700 to-amber-900' },
    { id: 'nature', name: 'Nature Walk', artist: 'Outdoor Sounds', listeners: '19k listening', file: '/audio/nature.mp3', color: 'from-emerald-700 to-emerald-900' },
];

const PLAYLISTS = [
    { name: 'Deep Work', desc: 'Ultimate focus engine', img: '/images/playlist-deep-work.jpg' },
    { name: 'Coffee Shop', desc: 'Bustling morning vibes', img: '/images/playlist-coffee.jpg' },
    { name: 'Rainy Day', desc: 'Cozy pitter-patter', img: '/images/playlist-rain.jpg' },
    { name: 'Nature Walk', desc: 'Birds and soft breeze', img: '/images/playlist-nature.jpg' },
    { name: 'Ocean Waves', desc: 'Calm shoreline retreat', img: '/images/playlist-ocean.jpg' },
];

const MOODS = [
    { label: 'Focus', icon: 'bolt' },
    { label: 'Relax', icon: 'spa' },
    { label: 'Create', icon: 'palette' },
    { label: 'Meditate', icon: 'self_improvement' },
];

export function AmbiancePlayer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeTrack = TRACKS[activeIndex];

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);
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
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header tabs */}
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Focus & Chill</span>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Hero card */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Hero */}
                            <div className={cn(
                                "relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br",
                                activeTrack.color
                            )}>
                                {/* Placeholder image overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                                    <div>
                                        <span className="inline-block px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold uppercase rounded-md mb-2">
                                            Trending Now
                                        </span>
                                        <h2 className="text-2xl font-bold text-white">{activeTrack.name}</h2>
                                        <p className="text-sm text-white/70">{activeTrack.artist} · {activeTrack.listeners}</p>
                                    </div>
                                    <button
                                        onClick={togglePlay}
                                        className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-110 transition-transform"
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current ml-0.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center gap-3 px-1">
                                <span className="text-[10px] text-muted-foreground font-medium">{Math.floor(progress * 0.04)}:{((progress * 2.4) % 60).toFixed(0).padStart(2, '0')}</span>
                                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">3:45</span>
                            </div>
                        </div>

                        {/* Right: Daily Flow + Mood */}
                        <div className="space-y-6">
                            {/* Your Daily Flow */}
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                                    <h3 className="text-sm font-semibold text-foreground">Your Daily Flow</h3>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">Tailored for your focus today.</p>

                                {/* Avatar stack */}
                                <div className="flex -space-x-2 mb-5">
                                    {["🌿", "☕", "🎵", "🌊", "+"].map((emoji, i) => (
                                        <div key={i} className={cn(
                                            "size-9 rounded-full border-2 border-card flex items-center justify-center text-sm",
                                            i === 4 ? "bg-primary text-white text-xs font-bold" : "bg-muted"
                                        )}>
                                            {emoji}
                                        </div>
                                    ))}
                                </div>

                                {/* Mood buttons */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-[16px]">tune</span>
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Set your mood</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {MOODS.map((mood) => (
                                        <button
                                            key={mood.label}
                                            className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-primary">{mood.icon}</span>
                                            {mood.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curated Playlists */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-foreground">Curated Playlists</h2>
                            <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                                View all <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {PLAYLISTS.map((playlist, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(Math.min(i, TRACKS.length - 1))}
                                    className="group text-left"
                                >
                                    <div className={cn(
                                        "aspect-square rounded-xl overflow-hidden mb-2 bg-gradient-to-br relative",
                                        i === 0 && "from-emerald-700 to-emerald-900",
                                        i === 1 && "from-amber-700 to-amber-900",
                                        i === 2 && "from-sky-700 to-sky-900",
                                        i === 3 && "from-green-700 to-green-900",
                                        i === 4 && "from-blue-500 to-cyan-600",
                                    )}>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                            <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                                                <Play size={18} className="fill-current ml-0.5" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 left-2">
                                            <span className="text-[10px] font-bold text-white/80 uppercase">{playlist.desc.split(' ')[0]}</span>
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
            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-3 flex items-center gap-6">
                {/* Track info */}
                <div className="flex items-center gap-3 min-w-[180px]">
                    <div className={cn(
                        "size-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                        activeTrack.color
                    )}>
                        <span className="material-symbols-outlined text-[18px]">music_note</span>
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
                        className="size-10 bg-primary rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-sm"
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
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
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
                            style={{
                                background: `linear-gradient(to right, #e8308c ${volume * 100}%, transparent ${volume * 100}%)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
