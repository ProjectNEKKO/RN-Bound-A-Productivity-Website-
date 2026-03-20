"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Plus, SkipBack, SkipForward } from "lucide-react";
import { useStore, TimerMode, type Task } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { StudyHeatmap } from "./StudyHeatmap";

const MINI_TRACK = {
    name: "Lofi Study Beats",
    artist: "Organic Textures x Vinyl Rain",
    file: "/audio/rain.mp3",
};

const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const FALLBACK_BARS = [26, 40, 48, 34, 54, 46, 10];

function formatTimer(seconds: number) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
}

function buildPlannerItems(tasks: Task[]) {
    const ranked = [...tasks].sort((a, b) => {
        const statusScore = (task: Task) => {
            if (task.status === "inProgress") return 0;
            if (task.status === "todo") return 1;
            if (task.status === "review") return 2;
            return 3;
        };

        return statusScore(a) - statusScore(b);
    });

    return ranked.slice(0, 3);
}

export function DashboardView() {
    const {
        timeLeft,
        timerMode,
        timerDurations,
        isRunning,
        autoStartBreaks,
        pomodorosCompleted,
        tasks,
        activeProjectId,
        setTimeLeft,
        setIsRunning,
        incrementPomodoros,
        setTimerMode,
        resetTimer,
        setActiveView,
        addStudyTime,
    } = useStore();

    const [miniPlaying, setMiniPlaying] = useState(false);
    const miniAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!miniAudioRef.current) {
            miniAudioRef.current = new Audio(MINI_TRACK.file);
            miniAudioRef.current.loop = true;
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                // Track study time if in Focus mode
                if (timerMode === "Focus") {
                    const todayStr = new Date().toISOString().split("T")[0];
                    addStudyTime(todayStr, 1);
                }
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);

            let nextMode: TimerMode = "Focus";

            if (timerMode === "Focus") {
                incrementPomodoros();
                nextMode = (pomodorosCompleted + 1) % 4 === 0 ? "Long Break" : "Short Break";
            }

            setTimerMode(nextMode);

            if (autoStartBreaks) {
                setTimeout(() => setIsRunning(true), 100);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoStartBreaks, incrementPomodoros, isRunning, pomodorosCompleted, setIsRunning, setTimeLeft, setTimerMode, timeLeft, timerMode, addStudyTime]);

    const projectTasks = useMemo(() => {
        if (!activeProjectId) return tasks;
        return tasks.filter((task) => task.projectId === activeProjectId);
    }, [activeProjectId, tasks]);

    const plannerItems = useMemo(() => buildPlannerItems(projectTasks), [projectTasks]);
    const completedCount = projectTasks.filter((task) => task.status === "done").length;
    const focusHours = ((pomodorosCompleted * timerDurations.Focus) / 3600).toFixed(1);
    const efficiency = projectTasks.length
        ? Math.min(99, Math.round((completedCount / projectTasks.length) * 100) || 0)
        : 82;
    const progress = timerDurations[timerMode] ? timeLeft / timerDurations[timerMode] : 0;
    const circumference = 2 * Math.PI * 86;
    const strokeDashoffset = circumference * (1 - progress);
    const chartBars = WEEKDAY_LABELS.map((_, index) => {
        if (index === 5) return 44;
        return FALLBACK_BARS[index];
    });

    const greetingName = "Nurse Lea";
    const dateLabel = "Productivity Hub • Friday, October 24";

    const toggleMiniPlay = () => {
        if (!miniAudioRef.current) return;

        if (miniPlaying) {
            miniAudioRef.current.pause();
            setMiniPlaying(false);
            return;
        }

        miniAudioRef.current.play()
            .then(() => setMiniPlaying(true))
            .catch(() => setMiniPlaying(false));
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 pb-6 lg:px-6 custom-scrollbar">
            <div className="mx-auto w-full max-w-[1400px] rounded-[2.25rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(253,249,250,0.9))] p-6 shadow-[0_24px_60px_rgba(133,102,120,0.08)] lg:p-8">
                <div className="mb-6">
                    <h1 className="text-[2.15rem] leading-none font-light tracking-[-0.04em] text-[#2f2640]">
                        Welcome back, <span className="font-extrabold text-[#7f5364]">{greetingName}</span>
                    </h1>
                    <p className="mt-2 text-[0.72rem] uppercase tracking-[0.28em] text-[#baa8b0]">
                        {dateLabel}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,980px)_320px] xl:justify-between">
                    <div className="space-y-6">
                        <section className="rounded-[2rem] bg-[linear-gradient(180deg,#f7a9b8_0%,#f5a1b0_100%)] px-8 py-7 shadow-[0_28px_60px_rgba(240,160,176,0.35)]">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-8 mt-2 flex h-[270px] w-full items-center justify-center">
                                    <div className="absolute h-[210px] w-[210px] rounded-full border-[5px] border-white/25" />
                                    <svg width="230" height="230" className="-rotate-90">
                                        <circle
                                            cx="115"
                                            cy="115"
                                            r="86"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.22)"
                                            strokeWidth="6"
                                        />
                                        <circle
                                            cx="115"
                                            cy="115"
                                            r="86"
                                            fill="transparent"
                                            stroke="white"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            className="transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center text-white">
                                        <span className="text-6xl font-medium tracking-[-0.06em]">
                                            {formatTimer(timeLeft)}
                                        </span>
                                        <span className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/80">
                                            {timerMode === "Focus" ? "Focus Session" : timerMode}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={resetTimer}
                                        className="flex size-10 items-center justify-center rounded-full bg-white/16 text-white/85 transition hover:bg-white/24"
                                        aria-label="Reset timer"
                                    >
                                        <span className="material-symbols-outlined text-[22px]">replay</span>
                                    </button>
                                    <button
                                        onClick={() => setIsRunning(!isRunning)}
                                        className="flex size-14 items-center justify-center rounded-full bg-white text-[#7e5d6c] shadow-[0_12px_30px_rgba(150,88,108,0.2)] transition hover:scale-[1.03]"
                                        aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                                    >
                                        {isRunning ? <Pause size={24} className="fill-current" /> : <Play size={24} className="ml-0.5 fill-current" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveView("timer")}
                                        className="flex size-10 items-center justify-center rounded-full bg-white/16 text-white/85 transition hover:bg-white/24"
                                        aria-label="Open timer view"
                                    >
                                        <span className="material-symbols-outlined text-[22px]">skip_next</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[2rem] bg-white/70 px-6 py-5 shadow-[0_18px_40px_rgba(133,102,120,0.08)] ring-1 ring-white/70">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#2c2438]">Daily Focus Stats</h2>
                                    <p className="text-sm text-[#a799a2]">Consistency is key to mastery.</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-right">
                                        <p className="text-[1.8rem] font-extrabold tracking-[-0.05em] text-[#7f5364]">{focusHours}h</p>
                                        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#c3b2b8]">Today</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[1.8rem] font-extrabold tracking-[-0.05em] text-[#7b6f62]">{efficiency}%</p>
                                        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#c3b2b8]">Efficiency</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 items-end gap-3 sm:gap-4">
                                {chartBars.map((height, index) => (
                                    <div key={WEEKDAY_LABELS[index]} className="flex flex-col items-center gap-3">
                                        <div className="flex h-[92px] w-full items-end justify-center">
                                            <div
                                                className={cn(
                                                    "w-full rounded-t-[1.35rem] bg-[#ece7e8]",
                                                    index === 5 && "bg-[#f3a5b6]"
                                                )}
                                                style={{ height: `${height}px` }}
                                            />
                                        </div>
                                        <span
                                            className={cn(
                                                "text-[0.62rem] font-semibold tracking-[0.18em] text-[#c1b5bb]",
                                                index === 5 && "text-[#8d6473]"
                                            )}
                                        >
                                            {WEEKDAY_LABELS[index]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <StudyHeatmap />

                        {/* Temporary developer button to add dummy data for heatmap verification */}
                        <button
                            onClick={() => {
                                const today = new Date();
                                for (let i = 0; i < 300; i++) {
                                    const d = new Date(today);
                                    d.setDate(d.getDate() - i);
                                    const dateStr = d.toISOString().split("T")[0];
                                    // Random seconds between 0 and 5 hours (18000s)
                                    const seconds = Math.floor(Math.random() * 18000);
                                    addStudyTime(dateStr, seconds);
                                }
                            }}
                            className="w-full text-xs text-[#a799a2] hover:text-[#7f5364] underline mt-2"
                        >
                            [Dev Only] Generate Heatmap Dummy Data
                        </button>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-[2rem] bg-white/58 p-5 shadow-[0_18px_40px_rgba(133,102,120,0.08)] ring-1 ring-white/70">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-[#2c2438]">Study Planner</h2>
                                <button
                                    onClick={() => setActiveView("tasks")}
                                    className="flex size-8 items-center justify-center rounded-full text-[#8f6b79] transition hover:bg-[#f8edf0]"
                                    aria-label="Open study planner"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {plannerItems.length > 0 ? plannerItems.map((task, index) => {
                                    const isDone = task.status === "done";
                                    const badgeLabel = isDone
                                        ? "Completed"
                                        : index === 0
                                            ? "High Priority"
                                            : task.category
                                                ? `${task.category} deck`
                                                : "Flashcards";

                                    return (
                                        <button
                                            key={task.id}
                                            onClick={() => setActiveView("tasks")}
                                            className="flex w-full items-start gap-3 rounded-[1.6rem] bg-white/92 px-4 py-4 text-left shadow-[0_10px_24px_rgba(170,150,160,0.12)] transition hover:-translate-y-0.5"
                                        >
                                            <span
                                                className={cn(
                                                    "mt-1 size-4 rounded-full border",
                                                    isDone ? "border-[#91a093] bg-[#91a093]" : "border-[#f0c7d0] bg-transparent"
                                                )}
                                            >
                                                {isDone && <span className="material-symbols-outlined block text-[14px] leading-4 text-white">check</span>}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className={cn("block text-base font-medium text-[#2c2438]", isDone && "text-[#a3a0a4] line-through")}>
                                                    {task.text}
                                                </span>
                                                <span className="mt-1 block text-xs text-[#c0b3b8]">
                                                    {task.description || task.dueDate || "Tap to continue planning"}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "mt-3 inline-flex rounded-full px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em]",
                                                        isDone
                                                            ? "bg-[#edf2ed] text-[#7e8a7d]"
                                                            : index === 0
                                                                ? "bg-[#ffe1e7] text-[#d2758c]"
                                                                : "bg-[#eef5e7] text-[#9ab07f]"
                                                    )}
                                                >
                                                    {badgeLabel}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                }) : (
                                    <button
                                        onClick={() => setActiveView("tasks")}
                                        className="flex w-full items-center justify-center rounded-[1.6rem] bg-white/92 px-4 py-8 text-sm font-medium text-[#a799a2] shadow-[0_10px_24px_rgba(170,150,160,0.12)] transition hover:-translate-y-0.5"
                                    >
                                        Add your first study task
                                    </button>
                                )}
                            </div>
                        </section>

                        <section className="rounded-[2rem] bg-white/72 px-5 py-5 shadow-[0_18px_40px_rgba(133,102,120,0.08)] ring-1 ring-white/70">
                            <span className="inline-flex rounded-full bg-[#fff1f4] px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#d2758c]">
                                Now Playing
                            </span>

                            <div className="mt-5 flex flex-col items-center text-center">
                                <div className="mb-4 flex size-[122px] items-end justify-center rounded-[1.35rem] bg-[linear-gradient(180deg,#a15e2f,#7b431a)] shadow-[0_16px_30px_rgba(142,91,48,0.28)]">
                                    <div className="mb-3 h-10 w-16 rounded-sm bg-[linear-gradient(180deg,#ead7b4,#c29255)] shadow-[0_10px_18px_rgba(64,32,12,0.18)]" />
                                </div>
                                <h3 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[#2c2438]">{MINI_TRACK.name}</h3>
                                <p className="mt-1 text-sm text-[#9f959c]">{MINI_TRACK.artist}</p>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-6">
                                <button className="text-[#8c7c83] transition hover:text-[#6f5d67]" aria-label="Previous track">
                                    <SkipBack size={18} className="fill-current" />
                                </button>
                                <button
                                    onClick={toggleMiniPlay}
                                    className="flex size-12 items-center justify-center rounded-full bg-[#fff8fa] text-[#8d6272] shadow-[0_10px_24px_rgba(183,151,165,0.18)] transition hover:scale-[1.03]"
                                    aria-label={miniPlaying ? "Pause track" : "Play track"}
                                >
                                    {miniPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="ml-0.5 fill-current" />}
                                </button>
                                <button onClick={() => setActiveView("music")} className="text-[#8c7c83] transition hover:text-[#6f5d67]" aria-label="Open music view">
                                    <SkipForward size={18} className="fill-current" />
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
