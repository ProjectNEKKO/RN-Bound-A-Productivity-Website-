import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TimerMode = "Focus" | "Short Break" | "Long Break";
export type ActiveView = 'home' | 'tasks' | 'timer' | 'music' | 'login' | 'signup';
export type TaskStatus = 'todo' | 'inProgress' | 'review' | 'done';

export interface CustomTimerDurations {
    "Focus": number;
    "Short Break": number;
    "Long Break": number;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    status: TaskStatus;
    category?: string;
    description?: string;
    dueDate?: string;
    commentCount?: number;
    assignee?: string;
}

interface AppState {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;

    // Auth State
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    logout: () => void;

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
    addTask: (text: string, status?: TaskStatus, category?: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTaskStatus: (id: string, status: TaskStatus) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            activeView: 'login',
            setActiveView: (view) => set({ activeView: view }),

            isAuthenticated: false,
            setIsAuthenticated: (auth) => set({ isAuthenticated: auth, activeView: auth ? 'home' : 'login' }),
            logout: () => set({ isAuthenticated: false, activeView: 'login' }),

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
                const newTimeLeft = state.timerMode === mode ? minutes * 60 : state.timeLeft;
                return {
                    timerDurations: newDurations,
                    timeLeft: newTimeLeft,
                    isRunning: false
                };
            }),
            setTimeLeft: (time) => set((state) => ({
                timeLeft: typeof time === 'function' ? time(state.timeLeft) : time
            })),
            setIsRunning: (isRunning) => set({ isRunning }),
            resetTimer: () => set((state) => ({ timeLeft: state.timerDurations[state.timerMode], isRunning: false })),

            tasks: [],
            addTask: (text, status = 'todo', category) => set((state) => ({
                tasks: [...state.tasks, { id: crypto.randomUUID(), text, completed: status === 'done', status, category }]
            })),
            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'done' : 'todo' } : t)
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),
            updateTaskStatus: (id, status) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, status, completed: status === 'done' } : t)
            })),
        }),
        {
            name: 'focus-hub-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                tasks: state.tasks,
                timerMode: state.timerMode,
                timerDurations: state.timerDurations,
                autoStartBreaks: state.autoStartBreaks,
                pomodorosCompleted: state.pomodorosCompleted,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
