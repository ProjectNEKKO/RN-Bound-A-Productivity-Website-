"use client";

export function TopBar({ title }: { title: string }) {
    return (
        <header className="glass-panel h-16 rounded-[1.5rem] px-8 flex items-center justify-between shadow-sm shrink-0">
            {/* Left: Search */}
            <div className="flex items-center gap-3 text-slate-400 w-96 group">
                <span className="material-symbols-outlined group-focus-within:text-primary transition-colors">search</span>
                <input
                    className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full placeholder-slate-400 text-foreground focus:outline-none"
                    placeholder="Search tasks, projects, or music..."
                    type="text"
                />
            </div>

            {/* Right: Status + Notifications + Profile */}
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-primary">Focus Mode On</span>
                </div>

                <button className="relative text-slate-400 hover:text-foreground transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-0 right-0 size-2 bg-red-400 rounded-full border-2 border-white dark:border-slate-900" />
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-foreground">Sarah J.</p>
                        <p className="text-[10px] text-slate-400">Pro Member</p>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
                        alt="Sarah J."
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                    />
                </div>
            </div>
        </header>
    );
}
