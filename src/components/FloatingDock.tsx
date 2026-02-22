"use client";

import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { Timer, CheckSquare, BarChart2, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingDock() {
    const { activeTab, setActiveTab } = useStore();

    const navItems = [
        { id: "timer", icon: Timer, label: "Timer" },
        { id: "tasks", icon: CheckSquare, label: "Tasks" },
        { id: "analytics", icon: BarChart2, label: "Analytics" },
    ] as const;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.nav
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-2 p-3 bg-foreground/90 text-background backdrop-blur-xl border border-border/20 rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "relative group p-4 rounded-full transition-all duration-300",
                            activeTab === item.id
                                ? "text-primary-foreground bg-primary shadow-lg scale-110"
                                : "text-background/50 hover:text-background hover:bg-background/10"
                        )}
                        aria-label={item.label}
                    >
                        <item.icon className="w-6 h-6" />

                        {/* Tooltip */}
                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                            {item.label}
                            <svg className="absolute w-full h-2 text-foreground left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                        </span>
                    </button>
                ))}

                <div className="w-px h-8 bg-border/50 mx-2" />

                <button
                    className="p-4 rounded-full text-background/50 hover:text-background hover:bg-background/10 transition-all duration-300"
                    aria-label="Settings"
                    onClick={() => console.log("Open Settings Modal (Todo)")}
                >
                    <Settings className="w-6 h-6" />
                </button>
            </motion.nav>
        </div>
    );
}
