"use client";

import { useEffect } from "react";
import { Play, Pause, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TimerMode } from "@/store/useStore";
import { SettingsModal } from "./SettingsModal";

export function TimerView() {
    const durations = [25, 50, 90];

    const {
        timerMode,
        timeLeft,
        timerDurations,
        isRunning,
        autoStartBreaks,
        pomodorosCompleted,
        setTimerMode,
        setTimeLeft,
        setIsRunning,
        incrementPomodoros,
        resetTimer,
        updateTimerDuration,
    } = useStore();

    // Request notification permissions on mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);

            if ("Notification" in window && Notification.permission === "granted") {
                const message = timerMode === "Focus"
                    ? "Focus session complete! Time for a break."
                    : "Break is over! Time to focus.";
                new Notification("Focus Hub", { body: message });
            }

            let nextMode: TimerMode = "Focus";

            if (timerMode === "Focus") {
                incrementPomodoros();
                const newPomodoroCount = pomodorosCompleted + 1;
                nextMode = (newPomodoroCount % 4 === 0) ? "Long Break" : "Short Break";
            } else {
                nextMode = "Focus";
            }

            setTimerMode(nextMode);

            if (autoStartBreaks) {
                setTimeout(() => {
                    setIsRunning(true);
                }, 100);
            }
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, timerMode, autoStartBreaks, pomodorosCompleted, setTimeLeft, setIsRunning, incrementPomodoros, setTimerMode]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        const timeString = formatTime(timeLeft);
        document.title = isRunning
            ? `(${timeString}) ${timerMode} - Focus Hub`
            : `Focus Hub`;
    }, [timeLeft, isRunning, timerMode]);

    const progress = timeLeft / timerDurations[timerMode];
    const circumference = 2 * Math.PI * 140;
    const strokeDashoffset = circumference * (1 - progress);

    const currentDurationMin = timerDurations["Focus"] / 60;

    const weekDays = ["M", "T", "W", "T", "F"];

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
                {/* Main timer area + side panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Main Timer */}
                    <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8 flex flex-col items-center relative">
                        <SettingsModal />

                        <h2 className="text-2xl font-bold text-foreground mb-1">Deep Focus Session</h2>
                        <p className="text-sm text-primary mb-8">Stay present, breathe, and flow.</p>

                        {/* Circular Timer */}
                        <div className="relative flex items-center justify-center mb-8">
                            <svg width="320" height="320" className="transform -rotate-90">
                                {/* Background track */}
                                <circle
                                    cx="160"
                                    cy="160"
                                    r="140"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    className="text-border"
                                />
                                {/* Progress */}
                                <circle
                                    cx="160"
                                    cy="160"
                                    r="140"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(232,48,140,0.3)]"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-6xl font-black text-foreground tracking-tight">
                                    {formatTime(timeLeft)}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">
                                    Minutes Left
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTimer}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                                    isRunning
                                        ? "bg-muted text-foreground hover:bg-muted/80"
                                        : "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/25"
                                )}
                                aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                            >
                                {isRunning ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
                                {isRunning ? "Pause" : "Start Timer"}
                            </button>

                            <button
                                onClick={() => {
                                    setIsRunning(false);
                                    setTimerMode("Short Break");
                                }}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-card border border-border text-foreground hover:bg-muted transition-all"
                            >
                                <Coffee size={16} />
                                Take Break
                            </button>

                        </div>
                    </div>

                    {/* Right: Side panels */}
                    <div className="space-y-6">
                        {/* Set Duration */}
                        <div className="bg-card rounded-2xl border border-border p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                <h3 className="font-semibold text-sm text-foreground">Set Duration</h3>
                            </div>
                            <div className="flex gap-2">
                                {durations.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => updateTimerDuration("Focus", d)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                                            currentDurationMin === d
                                                ? "bg-primary/10 text-primary border-2 border-primary"
                                                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border-2 border-transparent"
                                        )}
                                    >
                                        {d}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Focus Stats */}
                        <div className="bg-card rounded-2xl border border-border p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">local_fire_department</span>
                                    <h3 className="font-semibold text-sm text-foreground">Daily Focus Stats</h3>
                                </div>
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">OPTIMAL</span>
                            </div>

                            {/* Week day dots */}
                            <div className="flex justify-between mb-4 px-2">
                                {weekDays.map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                        <div className={cn(
                                            "size-6 rounded-full flex items-center justify-center text-[10px] font-semibold",
                                            i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {day}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Tasks Done</span>
                                    <span className="font-semibold text-foreground">{pomodorosCompleted} / 16</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Focus Time</span>
                                    <span className="font-semibold text-foreground">{Math.floor(pomodorosCompleted * 25 / 60)}h {(pomodorosCompleted * 25) % 60}m</span>
                                </div>
                            </div>
                        </div>

                        {/* Motivational Quote */}
                        <div className="bg-gradient-to-br from-primary to-pink-500 rounded-2xl p-5 text-white relative overflow-hidden">
                            <span className="text-4xl font-black opacity-20 absolute top-2 left-4">&ldquo;</span>
                            <p className="text-sm font-medium leading-relaxed mt-4 relative z-10">
                                &ldquo;Focus on being productive instead of busy.&rdquo;
                            </p>
                            <p className="text-xs font-semibold mt-3 opacity-80 relative z-10">— Tim Ferriss</p>
                        </div>
                    </div>
                </div>

                {/* Current Focus Task */}
                <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-lg">list_alt</span>
                        <h3 className="font-semibold text-sm text-foreground">Current Focus Task</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-1 ml-6">
                        <div className="size-4 rounded-full border-2 border-primary/30" />
                        <span className="text-sm text-muted-foreground">Design high-fidelity wireframes for Mobile App Dashboard</span>
                    </div>
                    <button className="text-xs font-semibold text-primary hover:underline">EDIT TASK</button>
                </div>
            </div>
        </div>
    );
}
