"use client";

export function TopBar({ title }: { title: string }) {
    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
            {/* Left: Page title */}
            <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            </div>

            {/* Right: Search + Status + Profile */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Search tasks, projects, or music..."
                        className="w-64 h-8 pl-9 pr-4 bg-muted/50 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    />
                </div>

                {/* Focus Mode indicator */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-primary">Focus Mode: On</span>
                </div>

                {/* Notification bell */}
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all" aria-label="Notifications">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>

                {/* User avatar */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-pink-300 flex items-center justify-center text-white text-[10px] font-bold">
                        S
                    </div>
                    <span className="text-xs font-medium text-foreground hidden lg:block">Sarah J.</span>
                </div>
            </div>
        </header>
    );
}
