"use client";

import { useStore, ActiveView } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems: { id: ActiveView; icon: string; filledIcon: string; label: string }[] = [
    { id: "home", icon: "home", filledIcon: "home", label: "Home" },
    { id: "projects", icon: "folder", filledIcon: "folder", label: "Projects" },
    { id: "tasks", icon: "check_circle", filledIcon: "check_circle", label: "Tasks" },
    { id: "timer", icon: "timer", filledIcon: "timer", label: "Timer" },
    { id: "music", icon: "music_note", filledIcon: "music_note", label: "Music" },
];

export function Sidebar() {
    const { activeView, setActiveView, logout } = useStore();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-24 flex flex-col items-center py-6 bg-background border-r border-border transition-all">
            <button
                onClick={() => setActiveView("home")}
                className="mb-6 flex size-11 items-center justify-center rounded-full bg-[#fff7f9] text-[#b07a89] shadow-inner"
            >
                <span className="text-lg font-bold tracking-[-0.04em]">RN</span>
            </button>

            <nav className="flex flex-1 flex-col items-center gap-4 px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={cn(
                            "group relative flex size-11 items-center justify-center rounded-full transition-all duration-300",
                            activeView === item.id
                                ? "bg-[#f7a5b6] text-[#8d5f70] shadow-[0_12px_24px_rgba(236,167,184,0.4)]"
                                : "text-[#9d8f97] hover:bg-[#faf4f6] hover:text-[#8d5f70]"
                        )}
                        title={item.label}
                    >
                        <span className={cn(
                            "material-symbols-outlined text-xl",
                            activeView === item.id && "filled"
                        )}>
                            {item.icon}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-4">
                <button
                    className="flex size-10 items-center justify-center rounded-full text-[#9d8f97] transition hover:bg-[#faf4f6] hover:text-[#8d5f70]"
                    title="Settings"
                >
                    <span className="material-symbols-outlined">settings</span>
                </button>

                <button
                    onClick={logout}
                    className="flex size-10 items-center justify-center rounded-full text-[#9d8f97] transition hover:bg-[#faf4f6] hover:text-[#8d5f70]"
                    title="Sign out"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                </button>
            </div>
        </aside>
    );
}
