"use client";

import { useStore, ActiveView } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems: { id: ActiveView; icon: string; label: string }[] = [
    { id: "home", icon: "home", label: "Home" },
    { id: "tasks", icon: "check_circle", label: "Tasks" },
    { id: "timer", icon: "timer", label: "Timer" },
    { id: "music", icon: "music_note", label: "Music" },
];

export function Sidebar() {
    const { activeView, setActiveView } = useStore();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-16 bg-card border-r border-border flex flex-col items-center py-5 z-50">
            {/* Logo */}
            <button
                onClick={() => setActiveView("home")}
                className="size-10 bg-gradient-to-br from-primary to-pink-400 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
            >
                <span className="material-symbols-outlined text-white text-lg">trending_up</span>
            </button>

            {/* Nav Items */}
            <nav className="flex flex-col items-center gap-1 flex-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative",
                            activeView === item.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        aria-label={item.label}
                        title={item.label}
                    >
                        <span className="material-symbols-outlined text-[22px]">{item.icon}</span>

                        {/* Active indicator */}
                        {activeView === item.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                        )}

                        {/* Tooltip */}
                        <span className="absolute left-full ml-3 px-2.5 py-1 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="flex flex-col items-center gap-2">
                <button
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    aria-label="Settings"
                >
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                </button>

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-300 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">
                    S
                </div>
            </div>
        </aside>
    );
}
