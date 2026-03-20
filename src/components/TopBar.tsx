"use client";

import { useTheme } from "next-themes";

export function TopBar({ title }: { title: string }) {
    const { theme, setTheme } = useTheme();

    return (
        <header className="mb-5 flex h-16 shrink-0 items-center justify-between gap-4 rounded-[1.75rem] bg-white/70 px-5 shadow-[0_16px_34px_rgba(133,102,120,0.08)] ring-1 ring-white/70">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex w-full max-w-[320px] items-center gap-3 rounded-full bg-[#f7f3f4] px-4 py-2.5 text-[#b4a6ad]">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <input
                        className="w-full bg-transparent p-0 text-sm text-[#71636b] placeholder:text-[#b4a6ad] focus:outline-none"
                        placeholder="Search resources..."
                        type="text"
                    />
                </div>
                <div className="hidden min-w-0 lg:block">
                    <p className="truncate text-sm font-medium text-[#b29ea8]">{title}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative flex size-10 items-center justify-center rounded-full text-[#937b86] transition hover:bg-[#f8edf0]">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute right-[11px] top-[10px] size-1.5 rounded-full bg-[#d9899f]" />
                </button>

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex size-10 items-center justify-center rounded-full text-[#937b86] transition hover:bg-[#f8edf0]"
                    title="Toggle theme"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {theme === "dark" ? "light_mode" : "dark_mode"}
                    </span>
                </button>

                <div className="flex items-center gap-3 rounded-full bg-white px-2.5 py-1.5 shadow-[0_8px_20px_rgba(160,136,148,0.12)]">
                    <span className="hidden text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#836674] sm:block">
                        RN Monogram
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d8c7bf,#a87567)] text-xs font-bold text-white shadow-inner">
                        RN
                    </div>
                </div>
            </div>
        </header>
    );
}
