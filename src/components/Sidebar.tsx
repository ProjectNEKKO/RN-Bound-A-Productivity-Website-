"use client";

import { useStore, ActiveView } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems: { id: ActiveView; icon: string; filledIcon: string; label: string }[] = [
    { id: "home", icon: "home", filledIcon: "home", label: "Home" },
    { id: "tasks", icon: "check_circle", filledIcon: "check_circle", label: "Tasks" },
    { id: "timer", icon: "timer", filledIcon: "timer", label: "Timer" },
    { id: "music", icon: "music_note", filledIcon: "music_note", label: "Music" },
];

export function Sidebar() {
    const { activeView, setActiveView, logout } = useStore();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-16 m-4 rounded-[2rem] glass-sidebar flex flex-col items-center py-8 gap-8 z-50">
            {/* Logo */}
            <button
                onClick={() => setActiveView("home")}
                className="size-12 bg-gradient-to-br from-primary to-pink-400 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center text-white mb-4 hover:scale-110 transition-transform"
            >
                <span className="material-symbols-outlined text-2xl">timer</span>
            </button>

            {/* Nav Items */}
            <nav className="flex flex-col gap-4 w-full px-4 items-center flex-1">
                {navItems.map((item) => (
                    <a
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={cn(
                            "group relative flex items-center justify-center size-11 rounded-full transition-all duration-300 cursor-pointer",
                            activeView === item.id
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-slate-400 hover:text-primary hover:bg-white/40 dark:hover:bg-white/5"
                        )}
                        title={item.label}
                    >
                        <span className={cn(
                            "material-symbols-outlined text-xl",
                            activeView === item.id && "filled"
                        )}>
                            {item.icon}
                        </span>
                    </a>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto flex flex-col gap-4 items-center">
                <button
                    className="size-10 rounded-full hover:bg-white/40 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
                    title="Settings"
                >
                    <span className="material-symbols-outlined">settings</span>
                </button>

                <button
                    onClick={logout}
                    className="size-10 rounded-full hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    title="Sign out"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                </button>

                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
                        alt="User avatar"
                        className="relative size-10 rounded-full object-cover ring-2 ring-white/50"
                    />
                </div>
            </div>
        </aside>
    );
}
