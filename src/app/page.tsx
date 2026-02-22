"use client";

import { TimerCard } from "@/components/TimerCard";
import { TaskRegistry } from "@/components/TaskRegistry";
import { AmbiancePlayer } from "@/components/AmbiancePlayer";

export default function Home() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-background relative overflow-hidden">
      {/* Decorative gradient orb for glassmorphism effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Hub Container */}
      <main className="relative w-full max-w-6xl z-10 font-sans mb-12">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8 pl-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Focus Hub
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              Find your rhythm, complete your tasks.
            </p>
          </div>
        </header>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-fit">
            {/* Timer Card */}
            <div className="bg-card/90 backdrop-blur-sm border border-primary/10 rounded-[2rem] shadow-xl shadow-primary/5 p-6">
              <TimerCard />
            </div>

            {/* Ambiance Player */}
            <div className="bg-card/90 backdrop-blur-sm border border-primary/10 rounded-[2rem] shadow-xl shadow-primary/5 p-6">
              <AmbiancePlayer />
            </div>
          </div>

          {/* Task Registry (Right Column) */}
          <div className="lg:col-span-2 bg-card/90 backdrop-blur-sm border border-primary/10 rounded-[2rem] shadow-xl shadow-primary/5 p-6 min-h-[500px]">
            <TaskRegistry />
          </div>

        </div>
      </main>
    </div>
  );
}
