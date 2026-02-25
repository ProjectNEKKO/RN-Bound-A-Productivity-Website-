"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardView } from "@/components/DashboardView";
import { TaskRegistry } from "@/components/TaskRegistry";
import { TimerView } from "@/components/TimerCard";
import { AmbiancePlayer } from "@/components/AmbiancePlayer";
import { useStore } from "@/store/useStore";

const VIEW_TITLES: Record<string, string> = {
  home: "Dashboard Overview",
  tasks: "Kanban Board",
  timer: "Focus Timer",
  music: "Ambiance",
};

export default function Home() {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col ml-16 h-screen">
        {/* Top bar */}
        <TopBar title={VIEW_TITLES[activeView] || "Dashboard"} />

        {/* View content */}
        {activeView === "home" && <DashboardView />}
        {activeView === "tasks" && <TaskRegistry />}
        {activeView === "timer" && <TimerView />}
        {activeView === "music" && <AmbiancePlayer />}
      </div>
    </div>
  );
}
