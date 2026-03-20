import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

// Number of weeks to display (GitHub shows ~52 weeks)
const WEEKS_TO_SHOW = 52;
const DAYS_IN_WEEK = 7;

// Color thresholds for the heatmap (in seconds)
// 0: none, > 0 to 1 hour: light, > 1 to 2.5 hours: medium, > 2.5 to 4 hours: dark, > 4 hours: darkest
const getIntensityClass = (seconds: number) => {
    if (seconds === 0) return "bg-[#ece7e8] border border-black/5"; // Empty state
    if (seconds <= 3600) return "bg-[#f8d6de] border border-[#f3c2cd]"; // Light (<= 1 hour)
    if (seconds <= 9000) return "bg-[#f3a5b6] border border-[#ea91a4]"; // Medium (<= 2.5 hours)
    if (seconds <= 14400) return "bg-[#df7d92] border border-[#d26b81]"; // Dark (<= 4 hours)
    return "bg-[#c4536b] border border-[#b2465e]"; // Darkest (> 4 hours)
};

const formatTime = (seconds: number) => {
    if (seconds === 0) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
};

export function StudyHeatmap() {
    const studyTimeByDate = useStore((state) => state.studyTimeByDate);

    // Generate dates for the past 52 weeks (up to today)
    const { dates, maxIntensity } = useMemo(() => {
        const today = new Date();
        const datesArray = [];
        
        // Find the start date (~1 year ago, aligned to Sunday)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (WEEKS_TO_SHOW * DAYS_IN_WEEK) + 1);

        let maxSeconds = 0;

        for (let i = 0; i < WEEKS_TO_SHOW * DAYS_IN_WEEK; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
            
            const seconds = studyTimeByDate[dateStr] || 0;
            if (seconds > maxSeconds) maxSeconds = seconds;
            
            datesArray.push({
                date: d,
                dateStr,
                seconds
            });
        }

        return { dates: datesArray, maxIntensity: maxSeconds };
    }, [studyTimeByDate]);

    // Group dates into columns of 7 days
    const columns: Array<Array<{ date: Date; dateStr: string; seconds: number }>> = [];
    for (let i = 0; i < dates.length; i += DAYS_IN_WEEK) {
        columns.push(dates.slice(i, i + DAYS_IN_WEEK));
    }

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <section className="rounded-[2rem] bg-white/70 px-6 py-6 shadow-[0_18px_40px_rgba(133,102,120,0.08)] ring-1 ring-white/70 overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-[#2c2438]">Study Consistency Map</h2>
                    <p className="text-sm text-[#a799a2]">Track your focus hours over the last year.</p>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar pb-2">
                <div className="min-w-fit flex gap-1">
                    {/* Day labels column */}
                    <div className="flex flex-col gap-1 pr-2 pt-5">
                        <span className="h-[12px] text-[10px] text-[#a799a2] font-medium leading-[12px]">Sun</span>
                        <span className="h-[12px] text-[10px] text-transparent leading-[12px]">Mon</span>
                        <span className="h-[12px] text-[10px] text-[#a799a2] font-medium leading-[12px]">Tue</span>
                        <span className="h-[12px] text-[10px] text-transparent leading-[12px]">Wed</span>
                        <span className="h-[12px] text-[10px] text-[#a799a2] font-medium leading-[12px]">Thu</span>
                        <span className="h-[12px] text-[10px] text-transparent leading-[12px]">Fri</span>
                        <span className="h-[12px] text-[10px] text-[#a799a2] font-medium leading-[12px]">Sat</span>
                    </div>

                    {/* Columns of weeks */}
                    {columns.map((week, colIndex) => {
                        // Show month label if the month changes from the previous column
                        const currentMonth = week[0].date.getMonth();
                        const prevMonth = colIndex > 0 ? columns[colIndex - 1][0].date.getMonth() : -1;
                        const showMonth = currentMonth !== prevMonth;

                        return (
                            <div key={`week-${colIndex}`} className="flex flex-col gap-1">
                                {/* Month label space */}
                                <div className="h-4 relative">
                                    {showMonth && (
                                        <span className="absolute whitespace-nowrap text-[10px] font-medium text-[#a799a2]">
                                            {monthLabels[week[0].date.getMonth()]}
                                        </span>
                                    )}
                                </div>
                                
                                {/* 7 days boxes */}
                                {week.map((day) => (
                                    <div
                                        key={day.dateStr}
                                        className={cn(
                                            "w-[12px] h-[12px] rounded-sm transition-transform hover:scale-125 hover:z-10 relative group cursor-pointer",
                                            getIntensityClass(day.seconds)
                                        )}
                                        title={`${formatTime(day.seconds)} on ${day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                    >
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-[#2c2438] text-white text-[10px] py-1 px-2 rounded font-medium z-50">
                                            {formatTime(day.seconds)} on {day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs font-medium text-[#a799a2]">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className={cn("w-3 h-3 rounded-sm", getIntensityClass(0))} />
                    <div className={cn("w-3 h-3 rounded-sm", getIntensityClass(1800))} />
                    <div className={cn("w-3 h-3 rounded-sm", getIntensityClass(7200))} />
                    <div className={cn("w-3 h-3 rounded-sm", getIntensityClass(10800))} />
                    <div className={cn("w-3 h-3 rounded-sm", getIntensityClass(18000))} />
                </div>
                <span>More</span>
            </div>
        </section>
    );
}
