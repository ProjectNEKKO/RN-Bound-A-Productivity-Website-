"use client";

import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { CheckSquare, Timer } from "lucide-react";
import { TimerCard } from "@/components/TimerCard";
import { TaskRegistry } from "@/components/TaskRegistry";

export default function Home() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-background relative overflow-hidden">
      {/* Decorative gradient orb for glassmorphism effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Hub Container */}
      <main className="relative w-full max-w-2xl bg-card border border-primary/10 rounded-3xl shadow-xl shadow-primary/5 p-6 sm:p-10 z-10 font-sans backdrop-blur-sm">

        {/* Header Section */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Focus Hub
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              Find your rhythm, complete your tasks.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-foreground/5 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('timer')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'timer'
                  ? "bg-card text-foreground shadow-sm"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              <Timer className="w-4 h-4" />
              <span>Timer</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'tasks'
                  ? "bg-card text-foreground shadow-sm"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tasks</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="min-h-[400px] relative mt-8">
          {activeTab === 'timer' ? (
            <TimerCard />
          ) : (
            <TaskRegistry />
          )}
        </div>

      </main>
    </div>
  );
}
