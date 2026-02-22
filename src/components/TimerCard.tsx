"use client";

import { useEffect } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TimerMode, TIMER_DURATIONS } from "@/store/useStore";

export function TimerCard() {
    const modes: TimerMode[] = ["Focus", "Short Break", "Long Break"];

    const {
        timerMode,
        timeLeft,
        isRunning,
        setTimerMode,
        setTimeLeft,
        setIsRunning,
        resetTimer
    } = useStore();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            // Auto-skip or simple stop when reaching 0
            setIsRunning(false);
            // Play a sound? Or just switch mode automatically. Let's keep it simple for now.
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, setTimeLeft, setIsRunning]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleSkip = () => {
        // Simple cycle logic
        const currentIndex = modes.indexOf(timerMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setTimerMode(nextMode);
    };

    // Calculate dash offset for a circular progress ring if we wanted to add it later. (Future proofing)
    // const progress = 1 - (timeLeft / TIMER_DURATIONS[timerMode]);

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Mode Selector */}
            <div className="flex p-1 bg-foreground/5 rounded-full">
                {modes.map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setTimerMode(mode)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                            timerMode === mode
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-foreground/60 hover:text-foreground"
                        )}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="relative flex items-center justify-center w-64 h-64 rounded-full bg-card border-[6px] border-primary/20 shadow-2xl shadow-primary/10 transition-colors duration-500">
                <h2 className="text-7xl font-sans tracking-tight text-foreground -mt-4 tabular-nums">
                    {formatTime(timeLeft)}
                </h2>

                {/* Decorative inner pulse if running */}
                {isRunning && (
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping -z-10" />
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={resetTimer}
                    className="p-3 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-2xl transition-all"
                    aria-label="Reset Timer"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <button
                    onClick={toggleTimer}
                    aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                    className={cn(
                        "flex items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 shadow-xl",
                        isRunning
                            ? "bg-card text-primary border-2 border-primary"
                            : "bg-primary text-primary-foreground hover:scale-105"
                    )}
                >
                    {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                <button
                    onClick={handleSkip}
                    className="p-3 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-2xl transition-all"
                    aria-label="Skip to Next Mode"
                >
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
}
