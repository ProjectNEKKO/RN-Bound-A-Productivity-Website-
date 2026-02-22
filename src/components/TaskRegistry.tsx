"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

export function TaskRegistry() {
    const [inputValue, setInputValue] = useState("");
    const { tasks, addTask, toggleTask, deleteTask } = useStore();

    const handleAdd = () => {
        if (inputValue.trim()) {
            addTask(inputValue.trim());
            setInputValue("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    // Sort tasks: pending first, then completed.
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500 max-h-[500px]">

            {/* Input Area */}
            <div className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What are you focusing on?"
                    className="w-full bg-foreground/5 border-none outline-none rounded-2xl px-6 py-4 text-foreground placeholder:text-foreground/40 pr-16 focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
                <button
                    onClick={handleAdd}
                    className="absolute right-2 top-2 p-2 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-md"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {sortedTasks.map((task) => (
                    <div
                        key={task.id}
                        className="group flex items-center justify-between p-4 bg-card border border-foreground/5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                    >
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleTask(task.id)}>
                            <button
                                className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors",
                                    task.completed
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-foreground/30 hover:border-primary"
                                )}
                            >
                                {task.completed && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <span className={cn(
                                "text-base transition-colors",
                                task.completed ? "text-foreground/40 line-through" : "text-foreground"
                            )}>
                                {task.text}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-foreground/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-12 text-foreground/40 text-sm">
                        No tasks yet. Add one above!
                    </div>
                )}
            </div>

        </div>
    );
}
