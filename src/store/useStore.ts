import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TimerMode = "Focus" | "Short Break" | "Long Break";

export const TIMER_DURATIONS: Record<TimerMode, number> = {
    "Focus": 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 15 * 60,
};

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface AppState {
    activeTab: 'timer' | 'tasks';
    setActiveTab: (tab: 'timer' | 'tasks') => void;

    // Timer State
    timerMode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
    setTimerMode: (mode: TimerMode) => void;
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
            timeLeft: TIMER_DURATIONS["Focus"],
            isRunning: false,

            setTimerMode: (mode) => set({ timerMode: mode, timeLeft: TIMER_DURATIONS[mode], isRunning: false }),
            setTimeLeft: (time) => set((state) => ({
                timeLeft: typeof time === 'function' ? time(state.timeLeft) : time
            })),
            setIsRunning: (isRunning) => set({ isRunning }),
            resetTimer: () => set((state) => ({ timeLeft: TIMER_DURATIONS[state.timerMode], isRunning: false })),

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
                activeTab: state.activeTab
            }), // Only save these fields, omit running timer state
        }
    )
);
