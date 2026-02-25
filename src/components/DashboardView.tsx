"use client";

import { useEffect } from "react";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TimerMode } from "@/store/useStore";
import { useState, useRef } from "react";

const MINI_TRACKS = [
    { id: 'lofi', name: 'Lofi Study Beats', artist: 'Chillhop Essentials', file: '/audio/rain.mp3', color: 'from-amber-600 to-amber-800' },
];

export function DashboardView() {
    const {
        timerMode,
        timeLeft,
        timerDurations,
        isRunning,
        pomodorosCompleted,
        setTimerMode,
        setTimeLeft,
        setIsRunning,
        incrementPomodoros,
        resetTimer,
        autoStartBreaks,
        tasks,
        setActiveView,
    } = useStore();

    // Mini audio player
    const [miniPlaying, setMiniPlaying] = useState(false);
    const miniAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!miniAudioRef.current) {
            miniAudioRef.current = new Audio(MINI_TRACKS[0].file);
            miniAudioRef.current.loop = true;
        }
    }, []);

    const toggleMiniPlay = () => {
        if (!miniAudioRef.current) return;
        if (miniPlaying) {
            miniAudioRef.current.pause();
            setMiniPlaying(false);
        } else {
            miniAudioRef.current.play().then(() => setMiniPlaying(true)).catch(console.error);
        }
    };

    // Timer logic (same as full TimerView)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            let nextMode: TimerMode = "Focus";
            if (timerMode === "Focus") {
                incrementPomodoros();
                nextMode = ((pomodorosCompleted + 1) % 4 === 0) ? "Long Break" : "Short Break";
            }
            setTimerMode(nextMode);
            if (autoStartBreaks) setTimeout(() => setIsRunning(true), 100);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, timerMode, autoStartBreaks, pomodorosCompleted, setTimeLeft, setIsRunning, incrementPomodoros, setTimerMode]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const progress = timeLeft / timerDurations[timerMode];
    const circumference = 2 * Math.PI * 80;
    const strokeDashoffset = circumference * (1 - progress);

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
                    <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        {/* Mini Pomodoro */}
                        <div className="bg-card rounded-2xl border border-border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">timer</span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pomodoro</span>
                                </div>
                                <button onClick={() => setActiveView('timer')} className="text-xs text-primary font-semibold hover:underline">
                                    Full View →
                                </button>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <svg width="200" height="200" className="transform -rotate-90">
                                        <circle cx="100" cy="100" r="80" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-border" />
                                        <circle
                                            cx="100" cy="100" r="80" fill="transparent"
                                            stroke="currentColor" strokeWidth="5"
                                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            className="text-primary transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-foreground tracking-tight">{formatTime(timeLeft)}</span>
                                        <span className="text-[10px] font-bold text-primary uppercase mt-1">{timerMode}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={() => setIsRunning(!isRunning)}
                                    className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                    aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                                >
                                    {isRunning ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
                                </button>
                                <button
                                    onClick={resetTimer}
                                    className="size-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Reset Timer"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Mini Music Player */}
                        <div className="bg-card rounded-2xl border border-border p-5">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "size-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shrink-0",
                                    MINI_TRACKS[0].color
                                )}>
                                    <span className="material-symbols-outlined text-2xl">music_note</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-foreground truncate">{MINI_TRACKS[0].name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{MINI_TRACKS[0].artist}</p>
                                    {miniPlaying && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-0.5 bg-primary h-2 animate-[bounce_1s_infinite]" />
                                                <div className="w-0.5 bg-primary h-3 animate-[bounce_1.2s_infinite]" />
                                                <div className="w-0.5 bg-primary h-1.5 animate-[bounce_0.8s_infinite]" />
                                            </div>
                                            <span className="text-[10px] font-bold text-primary uppercase">Playing</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mini progress bar */}
                            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>0:00</span>
                                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full w-[30%]" />
                                </div>
                                <span>3:45</span>
                            </div>

                            {/* Controls */}
                            <div className="flex justify-center gap-4 mt-3">
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                    <SkipBack size={16} className="fill-current" />
                                </button>
                                <button
                                    onClick={toggleMiniPlay}
                                    className="size-10 bg-card border border-border rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    {miniPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}
                                </button>
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                    <SkipForward size={16} className="fill-current" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right column: Project Tasks */}
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-lg">view_kanban</span>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Project Tasks</h3>
                                    <p className="text-xs text-muted-foreground">Design Sprint · {tasks.length} active tasks</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveView('tasks')} className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-all">
                                <Plus size={14} /> New Task
                            </button>
                        </div>

                        {/* Mini Kanban columns */}
                        <div className="grid grid-cols-3 gap-3">
                            {/* To Do */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-2 px-1">
                                    <div className="size-1.5 rounded-full bg-pink-500" />
                                    <span className="text-[10px] font-semibold text-muted-foreground">TO DO</span>
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1 rounded ml-auto">{todoTasks.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {todoTasks.slice(0, 3).map(task => (
                                        <div key={task.id} className="p-2.5 bg-muted/50 rounded-lg border border-border">
                                            {task.category && (
                                                <span className="text-[8px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded uppercase inline-block mb-1">{task.category}</span>
                                            )}
                                            <p className="text-[11px] font-medium text-foreground leading-snug">{task.text}</p>
                                        </div>
                                    ))}
                                    {todoTasks.length === 0 && (
                                        <p className="text-[10px] text-muted-foreground text-center py-4">No tasks</p>
                                    )}
                                </div>
                            </div>

                            {/* In Progress */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-2 px-1">
                                    <div className="size-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-semibold text-muted-foreground">IN PROGRESS</span>
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1 rounded ml-auto">{inProgressTasks.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {inProgressTasks.slice(0, 3).map(task => (
                                        <div key={task.id} className="p-2.5 bg-muted/50 rounded-lg border border-border">
                                            <p className="text-[11px] font-medium text-foreground leading-snug">{task.text}</p>
                                        </div>
                                    ))}
                                    {inProgressTasks.length === 0 && (
                                        <p className="text-[10px] text-muted-foreground text-center py-4">No tasks</p>
                                    )}
                                </div>
                            </div>

                            {/* Done */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-2 px-1">
                                    <div className="size-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-semibold text-muted-foreground">DONE</span>
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1 rounded ml-auto">{doneTasks.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {doneTasks.slice(0, 3).map(task => (
                                        <div key={task.id} className="p-2.5 bg-muted/50 rounded-lg border border-border">
                                            <p className="text-[11px] font-medium text-foreground leading-snug line-through opacity-60">{task.text}</p>
                                        </div>
                                    ))}
                                    {doneTasks.length === 0 && (
                                        <p className="text-[10px] text-muted-foreground text-center py-4">No tasks</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
