import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TimerMode = "Focus" | "Short Break" | "Long Break";

export interface CustomTimerDurations {
    "Focus": number;
    "Short Break": number;
    "Long Break": number;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export type Tab = 'timer' | 'tasks' | 'analytics';

interface AppState {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;

    // Timer State
    timerMode: TimerMode;
    timeLeft: number;
    timerDurations: CustomTimerDurations;
    isRunning: boolean;
    autoStartBreaks: boolean;
    pomodorosCompleted: number;

    setTimerMode: (mode: TimerMode) => void;
    setAutoStartBreaks: (autoStart: boolean) => void;
    incrementPomodoros: () => void;
    updateTimerDuration: (mode: TimerMode, minutes: number) => void;
    setTimeLeft: (time: number | ((prev: number) => number)) => void;
    setIsRunning: (isRunning: boolean) => void;
    resetTimer: () => void;

    // Task State
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            activeTab: 'timer',
            setActiveTab: (tab) => set({ activeTab: tab }),

            timerMode: "Focus",
            timerDurations: {
                "Focus": 25 * 60,
                "Short Break": 5 * 60,
                "Long Break": 15 * 60,
            },
            timeLeft: 25 * 60,
            isRunning: false,
            autoStartBreaks: false,
            pomodorosCompleted: 0,

            setTimerMode: (mode) => set((state) => ({
                timerMode: mode,
                timeLeft: state.timerDurations[mode],
                isRunning: false
            })),
            setAutoStartBreaks: (autoStart) => set({ autoStartBreaks: autoStart }),
            incrementPomodoros: () => set((state) => ({ pomodorosCompleted: state.pomodorosCompleted + 1 })),
            updateTimerDuration: (mode, minutes) => set((state) => {
                const newDurations = { ...state.timerDurations, [mode]: minutes * 60 };
                // If we are currently in this mode, dynamically update the time left
                const newTimeLeft = state.timerMode === mode ? minutes * 60 : state.timeLeft;
                return {
                    timerDurations: newDurations,
                    timeLeft: newTimeLeft,
                    isRunning: false // pause if settings change
                };
            }),
            setTimeLeft: (time) => set((state) => ({
                timeLeft: typeof time === 'function' ? time(state.timeLeft) : time
            })),
            setIsRunning: (isRunning) => set({ isRunning }),
            resetTimer: () => set((state) => ({ timeLeft: state.timerDurations[state.timerMode], isRunning: false })),

            tasks: [],
            addTask: (text) => set((state) => ({
                tasks: [...state.tasks, { id: crypto.randomUUID(), text, completed: false }]
            })),
            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),
        }),
        {
            name: 'focus-hub-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                tasks: state.tasks,
                timerMode: state.timerMode,
                timerDurations: state.timerDurations,
                autoStartBreaks: state.autoStartBreaks,
                pomodorosCompleted: state.pomodorosCompleted
            }), // Only save these fields, omit running timer state
        }
    )
);
