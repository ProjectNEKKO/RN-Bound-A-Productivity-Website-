"use client";

import { useState } from "react";
import { Plus, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TaskStatus } from "@/store/useStore";

// Placeholder data for demo
const PLACEHOLDER_ACTIVITY = [
    { user: "Sarah", action: "moved Brand guidelines to To Do", time: "2 hours ago", avatar: "S" },
    { user: "Marcus", action: 'commented on Landing page copy: "Looks great, let\'s ship it!"', time: "5 hours ago", avatar: "M" },
    { user: "Automation", action: "archived 4 completed tasks from previous sprint", time: "Yesterday at 11:45 PM", avatar: "A" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    design: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-600" },
    research: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600" },
    marketing: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600" },
    dev: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600" },
};

const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: "todo", label: "To Do", color: "bg-pink-500" },
    { id: "inProgress", label: "In Progress", color: "bg-blue-500" },
    { id: "review", label: "Review", color: "bg-amber-500" },
];

export function TaskRegistry() {
    const [inputValue, setInputValue] = useState("");
    const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
    const { tasks, addTask, deleteTask, toggleTask } = useStore();

    const handleAdd = (status: TaskStatus = "todo") => {
        if (inputValue.trim()) {
            addTask(inputValue.trim(), status, "design");
            setInputValue("");
            setAddingTo(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAdd(addingTo || "todo");
        if (e.key === "Escape") setAddingTo(null);
    };

    const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span>Kanban Board</span>
                            <span>/</span>
                            <span>Projects</span>
                            <span>/</span>
                            <span className="text-primary font-medium">Q4 Product Launch</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Project Tasks</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Manage your design system sprints and deliverables</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Avatar stack */}
                        <div className="flex -space-x-2">
                            {["S", "M", "J"].map((initial, i) => (
                                <div key={i} className={cn(
                                    "size-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold text-white",
                                    i === 0 && "bg-primary",
                                    i === 1 && "bg-amber-500",
                                    i === 2 && "bg-blue-500"
                                )}>
                                    {initial}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setAddingTo("todo")}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20"
                        >
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Kanban Columns */}
                    {columns.map((col) => {
                        const colTasks = getTasksByStatus(col.id);
                        return (
                            <div key={col.id} className="flex flex-col">
                                {/* Column header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("size-2 rounded-full", col.color)} />
                                        <span className="text-xs font-semibold text-foreground">{col.label}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {colTasks.length}
                                        </span>
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal size={14} />
                                    </button>
                                </div>

                                {/* Cards */}
                                <div className="flex flex-col gap-3 flex-1 min-h-[200px]">
                                    {colTasks.map((task) => {
                                        const catColor = CATEGORY_COLORS[task.category || "design"] || CATEGORY_COLORS.design;
                                        return (
                                            <div
                                                key={task.id}
                                                className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                            >
                                                {task.category && (
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md inline-block mb-2",
                                                        catColor.bg, catColor.text
                                                    )}>
                                                        {task.category}
                                                    </span>
                                                )}
                                                <h4 className="text-sm font-semibold text-foreground leading-snug mb-2">
                                                    {task.text}
                                                </h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <button onClick={() => toggleTask(task.id)} className="hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-[16px]">
                                                                {task.completed ? "check_circle" : "radio_button_unchecked"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteTask(task.id)}
                                                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Add card button */}
                                    {addingTo === col.id ? (
                                        <div className="bg-card rounded-xl border border-primary/30 p-3">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                placeholder="Task name..."
                                                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none mb-2"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAdd(col.id)}
                                                    className="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => setAddingTo(null)}
                                                    className="px-3 py-1 text-muted-foreground text-xs font-semibold hover:text-foreground"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingTo(col.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg text-xs font-medium transition-all"
                                        >
                                            <Plus size={14} />
                                            Add card
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Activity Feed + Sprint Goal */}
                    <div className="space-y-6">
                        {/* Activity Feed */}
                        <div className="bg-card rounded-2xl border border-border p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {PLACEHOLDER_ACTIVITY.map((activity, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                                            {activity.avatar}
                                        </div>
                                        <div>
                                            <p className="text-xs text-foreground leading-relaxed">
                                                <span className="font-semibold">{activity.user}</span> {activity.action}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sprint Goal */}
                        <div className="bg-gradient-to-br from-primary to-pink-500 rounded-2xl p-5 text-white">
                            <h3 className="text-sm font-bold mb-1">Sprint Goal</h3>
                            <p className="text-xs leading-relaxed opacity-90 mb-3">
                                Complete all mobile designs and handoff for development by Friday.
                            </p>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-semibold opacity-80">82%</span>
                            </div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full w-[82%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
