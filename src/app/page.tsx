"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardView } from "@/components/DashboardView";
import { TaskRegistry } from "@/components/TaskRegistry";
import { TimerView } from "@/components/TimerCard";
import { AmbiancePlayer } from "@/components/AmbiancePlayer";
import { LoginView } from "@/components/LoginView";
import { SignupView } from "@/components/SignupView";
import { useStore } from "@/store/useStore";

const VIEW_TITLES: Record<string, string> = {
  home: "Dashboard Overview",
  tasks: "Kanban Board",
  timer: "Focus Timer",
  music: "Ambiance",
};

export default function Home() {
  const { activeView, isAuthenticated } = useStore();

  // Auth screens — no sidebar/topbar
  if (!isAuthenticated) {
    if (activeView === "signup") return <SignupView />;
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[100px] pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — offset for the floating sidebar (w-24 + m-4 = 112px) */}
      <div className="flex-1 flex flex-col h-screen ml-[112px] pr-4 py-4 gap-4 relative z-10 overflow-hidden">
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
