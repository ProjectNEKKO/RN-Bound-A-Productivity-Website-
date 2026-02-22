import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, CloudRain, Coffee, CloudLightning } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const TRACKS = [
    { id: 'rain', name: 'Rain', icon: CloudRain, file: '/audio/rain.mp3' },
    { id: 'cafe', name: 'Cafe', icon: Coffee, file: '/audio/cafe.mp3' },
    { id: 'nature', name: 'Nature', icon: CloudLightning, file: '/audio/nature.mp3' },
];

export function AmbiancePlayer() {
    const [activeTrack, setActiveTrack] = useState(TRACKS[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio element if it doesn't exist
        if (!audioRef.current) {
            audioRef.current = new Audio(activeTrack.file);
            audioRef.current.loop = true;
        }
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        // Pause current audio before switching source
        const wasPlaying = isPlaying;
        if (wasPlaying) {
            audioRef.current.pause();
        }

        // Switch track and resume if playing
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

    return (
        <div className="flex flex-col gap-6 text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Ambiance</h2>
                <div className="flex items-center gap-1.5 opacity-60 bg-foreground/5 px-2.5 py-1 rounded-full text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                        {isPlaying && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        )}
                        <span className={cn("relative inline-flex rounded-full h-2 w-2", isPlaying ? "bg-primary" : "bg-foreground/40")}></span>
                    </span>
                    {isPlaying ? 'Playing' : 'Paused'}
                </div>
            </div>

            {/* Main Controls row */}
            <div className="flex items-center gap-4 bg-foreground/5 p-2 rounded-2xl">
                <button
                    onClick={togglePlay}
                    className="bg-primary text-primary-foreground h-12 w-12 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md flex-shrink-0"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                </button>

                <div className="flex-1 flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between text-xs font-medium opacity-70">
                        <span>{activeTrack.name}</span>
                        <Volume2 size={14} />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary outline-none focus-visible:ring-2 ring-primary"
                        aria-label="Volume"
                    />
                </div>
            </div>

            {/* Track Selector */}
            <div className="grid grid-cols-3 gap-2">
                {TRACKS.map((track) => {
                    const Icon = track.icon;
                    const isActive = track.id === activeTrack.id;

                    return (
                        <button
                            key={track.id}
                            onClick={() => setActiveTrack(track)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 py-3 rounded-xl transition-all border border-transparent",
                                isActive
                                    ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                                    : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground"
                            )}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{track.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
