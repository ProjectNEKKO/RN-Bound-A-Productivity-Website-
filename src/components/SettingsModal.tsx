"use client";

import { useStore, TimerMode } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Settings, X } from "lucide-react";

export function SettingsModal() {
    const { timerDurations, updateTimerDuration, autoStartBreaks, setAutoStartBreaks } = useStore();

    // Local state to hold input values before saving
    const [localDurations, setLocalDurations] = useState(timerDurations);

    // Sync local state when global state updates (e.g., on mount or when reset)
    useEffect(() => {
        setLocalDurations(timerDurations);
    }, [timerDurations]);

    const handleSave = () => {
        // Convert the local durations (in seconds) back to minutes when sending to updateTimerDuration
        updateTimerDuration("Focus", localDurations["Focus"] / 60);
        updateTimerDuration("Short Break", localDurations["Short Break"] / 60);
        updateTimerDuration("Long Break", localDurations["Long Break"] / 60);
    };

    const handleChange = (mode: TimerMode, valueStr: string) => {
        const value = parseInt(valueStr, 10);
        if (!isNaN(value) && value > 0) {
            setLocalDurations(prev => ({
                ...prev,
                [mode]: value * 60 // store internally as seconds
            }));
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary z-10"
                    aria-label="Timer Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-card border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">

                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-black text-foreground">
                            Timer Settings
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-2 rounded-full text-foreground/50 hover:bg-foreground/5 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Auto-start Breaks</h3>
                                <p className="text-xs text-foreground/50 mt-1">Automatically start the timer when a focus session ends.</p>
                            </div>
                            <button
                                onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                                    autoStartBreaks ? "bg-primary" : "bg-foreground/20"
                                )}
                            >
                                <span className={cn(
                                    "w-4 h-4 rounded-full bg-background transition-transform",
                                    autoStartBreaks ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>

                        {(["Focus", "Short Break", "Long Break"] as TimerMode[]).map((mode) => (
                            <div key={mode} className="flex items-center justify-between">
                                <label htmlFor={`input-${mode}`} className="text-sm font-semibold text-foreground/80">
                                    {mode} <span className="text-foreground/40 font-normal ml-1">(min)</span>
                                </label>
                                <input
                                    id={`input-${mode}`}
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={localDurations[mode] / 60}
                                    onChange={(e) => handleChange(mode, e.target.value)}
                                    className="w-20 px-3 py-2 bg-background border border-border rounded-xl text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
                        <Dialog.Close asChild>
                            <button className="px-5 py-2.5 rounded-xl font-semibold text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors">
                                Cancel
                            </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:brightness-110 transition-all hover:-translate-y-0.5"
                            >
                                Save Changes
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
