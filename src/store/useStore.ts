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

export interface Project {
    id: string;
    name: string;
    description?: string;
    color?: string;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    status: TaskStatus;
    projectId: string;
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

    // Project State
    projects: Project[];
    activeProjectId: string | null;
    addProject: (name: string, description?: string, color?: string) => string;
    deleteProject: (id: string) => void;
    updateProject: (id: string, updates: Partial<Omit<Project, 'id'>>) => void;
    setActiveProject: (id: string) => void;

    // Task State
    tasks: Task[];
    addTask: (text: string, status?: TaskStatus, category?: string, description?: string, dueDate?: string, assignee?: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTaskStatus: (id: string, status: TaskStatus) => void;
    updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
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

            // Project State
            projects: [],
            activeProjectId: null,
            addProject: (name, description, color) => {
                const id = crypto.randomUUID();
                set((state) => ({
                    projects: [...state.projects, { id, name, description, color }],
                    activeProjectId: id,
                }));
                return id;
            },
            deleteProject: (id) => set((state) => {
                const remaining = state.projects.filter(p => p.id !== id);
                const newActiveId = state.activeProjectId === id
                    ? (remaining.length > 0 ? remaining[0].id : null)
                    : state.activeProjectId;
                return {
                    projects: remaining,
                    activeProjectId: newActiveId,
                    tasks: state.tasks.filter(t => t.projectId !== id),
                };
            }),
            updateProject: (id, updates) => set((state) => ({
                projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
            })),
            setActiveProject: (id) => set({ activeProjectId: id }),

            // Task State
            tasks: [],
            addTask: (text, status = 'todo', category, description, dueDate, assignee) => set((state) => {
                const projectId = state.activeProjectId;
                if (!projectId) return state;
                return {
                    tasks: [...state.tasks, { id: crypto.randomUUID(), text, completed: status === 'done', status, projectId, category, description, dueDate, assignee }]
                };
            }),
            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'done' : 'todo' } : t)
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),
            updateTaskStatus: (id, status) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, status, completed: status === 'done' } : t)
            })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
            })),
        }),
        {
            name: 'focus-hub-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                tasks: state.tasks,
                projects: state.projects,
                activeProjectId: state.activeProjectId,
                timerMode: state.timerMode,
                timerDurations: state.timerDurations,
                autoStartBreaks: state.autoStartBreaks,
                pomodorosCompleted: state.pomodorosCompleted,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
