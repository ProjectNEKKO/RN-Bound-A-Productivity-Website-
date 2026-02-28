"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TimerMode } from "@/store/useStore";

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

    // Timer logic
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
    const strokeDashoffset = 552.92 * (1 - progress);

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
                {/* Page header */}
                <div className="mb-6 px-1">
                    <h1 className="text-2xl font-black tracking-tight text-foreground">Dashboard Overview</h1>
                    <p className="text-slate-400 text-sm">Here&apos;s what&apos;s happening today.</p>
                </div>

                {/* Bento Grid */}
                <div className="bento-grid" style={{ minHeight: 'calc(100vh - 180px)' }}>

                    {/* ═══ Pomodoro Card ═══ col-span-4 row-span-7 */}
                    <div className="col-span-12 lg:col-span-4 lg:row-span-7 glass-panel rounded-[2rem] p-8 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="w-full flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">timer</span> Pomodoro
                            </h3>
                            <button onClick={() => setActiveView('timer')} className="text-slate-300 hover:text-slate-500 transition-colors">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>

                        {/* Circular Timer SVG */}
                        <div className="relative flex items-center justify-center my-2 flex-1">
                            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                            <svg className="w-48 h-48 transform -rotate-90 relative z-10">
                                <circle className="text-muted" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="6" />
                                <circle
                                    className="text-primary drop-shadow-[0_0_10px_rgba(232,48,140,0.4)] transition-all duration-1000 ease-linear"
                                    cx="96" cy="96" fill="transparent" r="88"
                                    stroke="currentColor" strokeDasharray="552.92" strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round" strokeWidth="6"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center z-10">
                                <span className="text-5xl font-black text-foreground tracking-tighter">{formatTime(timeLeft)}</span>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">{timerMode}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-6 mt-2 items-center">
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className="size-16 rounded-2xl bg-gradient-to-br from-primary to-pink-600 text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                                aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                            >
                                {isRunning
                                    ? <Pause size={28} className="fill-current" />
                                    : <span className="material-symbols-outlined filled text-4xl">play_arrow</span>
                                }
                            </button>
                            <button
                                onClick={resetTimer}
                                className="size-12 rounded-xl bg-muted text-muted-foreground hover:text-primary flex items-center justify-center transition-colors"
                                aria-label="Reset Timer"
                            >
                                <span className="material-symbols-outlined text-2xl">refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* ═══ Project Tasks Card ═══ col-span-8 row-span-12 */}
                    <div className="col-span-12 lg:col-span-8 lg:row-span-12 glass-panel rounded-[2rem] p-8 shadow-sm flex flex-col relative overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600">
                                    <span className="material-symbols-outlined">view_kanban</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold leading-tight text-foreground">Project Tasks</h3>
                                    <p className="text-xs text-slate-400">Design Sprint · {tasks.length} active tasks</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveView('tasks')}
                                className="bg-card border border-border px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-muted transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">add</span> New Task
                            </button>
                        </div>

                        {/* Kanban Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                            {/* TO DO */}
                            <div className="flex flex-col gap-4 bg-muted/40 rounded-2xl p-2 h-full">
                                <div className="flex items-center gap-2 px-2 py-2">
                                    <div className="size-2 rounded-full bg-slate-400" />
                                    <span className="font-bold text-xs text-slate-500 tracking-wide">TO DO</span>
                                    <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold text-muted-foreground ml-auto">{todoTasks.length}</span>
                                </div>
                                <div className="flex flex-col gap-3 overflow-y-auto pr-1 h-full custom-scrollbar">
                                    {todoTasks.slice(0, 4).map(task => (
                                        <div key={task.id} className="p-4 bg-card rounded-xl border border-border shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
                                            {task.category && (
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md uppercase tracking-wide border border-primary/10">{task.category}</span>
                                                </div>
                                            )}
                                            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{task.text}</h4>
                                            {task.description && (
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                                            )}
                                            <div className="flex items-center mt-3 pt-3 border-t border-border/50">
                                                <div className="flex -space-x-2">
                                                    <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary border border-card">SJ</div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 ml-auto font-medium">Today</span>
                                            </div>
                                        </div>
                                    ))}
                                    {todoTasks.length === 0 && (
                                        <p className="text-[10px] text-slate-400 text-center py-6">No tasks</p>
                                    )}
                                </div>
                            </div>

                            {/* IN PROGRESS */}
                            <div className="flex flex-col gap-4 bg-muted/40 rounded-2xl p-2 h-full">
                                <div className="flex items-center gap-2 px-2 py-2">
                                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                                    <span className="font-bold text-xs text-slate-500 tracking-wide">IN PROGRESS</span>
                                    <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-primary ml-auto">{inProgressTasks.length}</span>
                                </div>
                                <div className="flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar">
                                    {inProgressTasks.slice(0, 4).map(task => (
                                        <div key={task.id} className="p-4 bg-card rounded-xl border-l-4 border-l-primary shadow-sm hover:-translate-y-1 transition-transform duration-300">
                                            <h4 className="font-bold text-sm text-foreground">{task.text}</h4>
                                            {/* Inline progress bar */}
                                            <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: '45%' }} />
                                            </div>
                                            <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400">
                                                <span>45% Complete</span>
                                                <span>2 days left</span>
                                            </div>
                                        </div>
                                    ))}
                                    {inProgressTasks.length === 0 && (
                                        <p className="text-[10px] text-slate-400 text-center py-6">No tasks</p>
                                    )}
                                </div>
                            </div>

                            {/* DONE */}
                            <div className="flex flex-col gap-4 bg-muted/40 rounded-2xl p-2 h-full">
                                <div className="flex items-center gap-2 px-2 py-2">
                                    <div className="size-2 rounded-full bg-emerald-400" />
                                    <span className="font-bold text-xs text-slate-500 tracking-wide">DONE</span>
                                    <span className="bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-500 ml-auto">{doneTasks.length}</span>
                                </div>
                                <div className="flex flex-col gap-3 opacity-60 hover:opacity-100 transition-opacity overflow-y-auto custom-scrollbar">
                                    {doneTasks.slice(0, 4).map(task => (
                                        <div key={task.id} className="p-4 bg-muted/50 rounded-xl border border-transparent shadow-none">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                                                <h4 className="font-bold text-sm text-muted-foreground line-through">{task.text}</h4>
                                            </div>
                                        </div>
                                    ))}
                                    {doneTasks.length === 0 && (
                                        <p className="text-[10px] text-slate-400 text-center py-6">No tasks</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══ Music Player Card ═══ col-span-4 row-span-5 */}
                    <div className="col-span-12 lg:col-span-4 lg:row-span-5 glass-panel rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                        {/* Blurred album art background */}
                        <div className="absolute inset-0 z-0 opacity-10 blur-xl scale-110">
                            <div className={cn("w-full h-full bg-gradient-to-br", MINI_TRACKS[0].color)} />
                        </div>

                        {/* Track info + Album art */}
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={cn(
                                "size-24 rounded-2xl overflow-hidden shadow-lg shadow-black/10 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br flex items-center justify-center text-white",
                                MINI_TRACKS[0].color
                            )}>
                                <span className="material-symbols-outlined text-4xl">music_note</span>
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="size-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-lg">open_in_full</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg truncate text-foreground">{MINI_TRACKS[0].name}</h4>
                                <p className="text-sm text-slate-500 font-medium truncate">{MINI_TRACKS[0].artist}</p>
                                {miniPlaying && (
                                    <div className="flex items-center gap-1.5 mt-2 bg-card/50 w-fit px-2 py-1 rounded-lg">
                                        <div className="flex gap-0.5 items-end h-3">
                                            <div className="w-0.5 bg-primary h-2 animate-[bounce_1s_infinite]" />
                                            <div className="w-0.5 bg-primary h-3 animate-[bounce_1.2s_infinite]" />
                                            <div className="w-0.5 bg-primary h-1.5 animate-[bounce_0.8s_infinite]" />
                                        </div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Playing</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress / Seekbar */}
                        <div className="space-y-3 mt-4 relative z-10">
                            <div className="relative w-full h-1.5 bg-muted/50 rounded-full overflow-hidden cursor-pointer group/progress">
                                <div className="absolute top-0 left-0 bg-primary h-full rounded-full relative" style={{ width: miniPlaying ? '65%' : '0%' }}>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-white rounded-full shadow-sm opacity-0 group-hover/progress:opacity-100" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                <span>{miniPlaying ? '02:45' : '0:00'}</span>
                                <span>04:12</span>
                            </div>
                        </div>

                        {/* Playback controls */}
                        <div className="flex justify-center items-center gap-6 mt-1 relative z-10">
                            <button className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                                <span className="material-symbols-outlined text-2xl">skip_previous</span>
                            </button>
                            <button
                                onClick={toggleMiniPlay}
                                className={cn(
                                    "size-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ring-4 ring-primary/5",
                                    miniPlaying
                                        ? "bg-card text-primary"
                                        : "bg-card text-primary"
                                )}
                            >
                                <span className="material-symbols-outlined text-3xl filled">
                                    {miniPlaying ? 'pause' : 'play_arrow'}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveView('music')}
                                className="text-slate-400 hover:text-primary transition-colors hover:scale-110 transform duration-200"
                            >
                                <span className="material-symbols-outlined text-2xl">skip_next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
