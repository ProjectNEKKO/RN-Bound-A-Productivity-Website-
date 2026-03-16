"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, MoreHorizontal, SlidersHorizontal, Calendar, MessageSquare, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TaskStatus, Task } from "@/store/useStore";

/* ─── Placeholder Activity Feed ─── */
const PLACEHOLDER_ACTIVITY = [
    { user: "Sarah", action: "moved Brand guidelines to To Do", time: "2 hours ago", avatar: "S", color: "bg-primary" },
    { user: "Marcus", action: 'commented on Landing page copy: "Looks great, let\'s ship it!"', time: "5 hours ago", avatar: "M", color: "bg-amber-500" },
    { user: "Automation", action: "archived 4 completed tasks from previous sprint", time: "Yesterday at 11:45 PM", avatar: "A", color: "bg-muted text-muted-foreground" },
];

/* ─── Seed Tasks — pre-populate the board on first load ─── */
const SEED_TASKS: Omit<Task, "id">[] = [
    { text: "Create brand guidelines for mobile app", description: "Define typography, color palette, and component spacing for the world.", status: "todo", completed: false, category: "design", dueDate: "Oct 24", commentCount: 0, assignee: "S" },
    { text: "Social media assets for launch", description: "", status: "todo", completed: false, category: "marketing", dueDate: "High Priority", commentCount: 0, assignee: "M" },
    { text: "API integration for dashboard heroic boxes", description: "Full stack", status: "inProgress", completed: false, category: "dev", dueDate: "", commentCount: 2, assignee: "J" },
    { text: "Figma Component Library Update", description: "", status: "inProgress", completed: false, category: "design", dueDate: "14 Storybes", commentCount: 0, assignee: "S" },
    { text: "Landing page copy review", description: "Review all landing page sections and finalise wording.", status: "review", completed: false, category: "marketing", dueDate: "Oct 28", commentCount: 1, assignee: "M" },
    { text: "Accessibility audit report", description: "Run WCAG 2.1 AA audit on all public-facing pages.", status: "review", completed: false, category: "research", dueDate: "Nov 1", commentCount: 0, assignee: "J" },
    { text: "Onboarding flow illustrations", description: "Final set of 5 illustrations delivered.", status: "done", completed: true, category: "design", dueDate: "Oct 18", commentCount: 3, assignee: "S" },
];

/* ─── Category badge colors ─── */
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    design: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-600" },
    research: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600" },
    marketing: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600" },
    dev: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600" },
};

/* ─── Assignee avatar colors ─── */
const ASSIGNEE_COLORS: Record<string, string> = {
    S: "bg-primary",
    M: "bg-amber-500",
    J: "bg-blue-500",
};

/* ─── Category options ─── */
const CATEGORY_OPTIONS = ["design", "research", "marketing", "dev"];

/* ─── Assignee options ─── */
const ASSIGNEE_OPTIONS = [
    { value: "S", label: "Sarah" },
    { value: "M", label: "Marcus" },
    { value: "J", label: "Jake" },
];

/* ─── All 4 columns including Done ─── */
const columns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: "todo", label: "To Do", dotColor: "bg-pink-500" },
    { id: "inProgress", label: "In Progress", dotColor: "bg-blue-500" },
    { id: "review", label: "Review", dotColor: "bg-amber-500" },
    { id: "done", label: "Done", dotColor: "bg-emerald-500" },
];

/* ─── Task Modal Component ─── */
function TaskModal({
    isOpen,
    onClose,
    task,
    onSave,
    onDelete,
}: {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null; // null = creating new task
    onSave: (data: { text: string; description: string; status: TaskStatus; category: string; dueDate: string; assignee: string }) => void;
    onDelete?: () => void;
}) {
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("todo");
    const [category, setCategory] = useState("design");
    const [dueDate, setDueDate] = useState("");
    const [assignee, setAssignee] = useState("S");
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (task) {
                setText(task.text);
                setDescription(task.description || "");
                setStatus(task.status);
                setCategory(task.category || "design");
                setDueDate(task.dueDate || "");
                setAssignee(task.assignee || "S");
            } else {
                setText("");
                setDescription("");
                setStatus("todo");
                setCategory("design");
                setDueDate("");
                setAssignee("S");
            }
        }
    }, [isOpen, task]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSave({ text: text.trim(), description: description.trim(), status, category, dueDate: dueDate.trim(), assignee });
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) onClose();
    };

    const isEditing = !!task;

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                        {isEditing ? "Edit Task" : "New Task"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Task Subject */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Task Body / Description */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details about this task..."
                            rows={3}
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    {/* Row: Status + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                {columns.map((col) => (
                                    <option key={col.id} value={col.id}>{col.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row: Due Date + Assignee */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                Due Date
                            </label>
                            <input
                                type="text"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                placeholder="e.g. Oct 24"
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                Assignee
                            </label>
                            <select
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                {ASSIGNEE_OPTIONS.map((a) => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            {isEditing && onDelete && (
                                <button
                                    type="button"
                                    onClick={() => { onDelete(); onClose(); }}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20"
                            >
                                {isEditing ? "Save Changes" : "Create Task"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function TaskRegistry() {
    const [inputValue, setInputValue] = useState("");
    const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
    const { tasks, addTask, deleteTask, updateTaskStatus, updateTask } = useStore();

    /* ── Modal state ── */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    /* ── Drag state ── */
    const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

    /* Seed the board with sample tasks on first load if empty */
    useEffect(() => {
        if (tasks.length === 0) {
            const seeded: Task[] = SEED_TASKS.map((t) => ({
                ...t,
                id: crypto.randomUUID(),
            }));
            useStore.setState({ tasks: seeded });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    /* ── Modal handlers ── */
    const openNewTaskModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditTaskModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleModalSave = (data: { text: string; description: string; status: TaskStatus; category: string; dueDate: string; assignee: string }) => {
        if (editingTask) {
            updateTask(editingTask.id, {
                text: data.text,
                description: data.description,
                status: data.status,
                category: data.category,
                dueDate: data.dueDate,
                assignee: data.assignee,
                completed: data.status === "done",
            });
        } else {
            addTask(data.text, data.status, data.category, data.description, data.dueDate, data.assignee);
        }
    };

    /* ── Drag and Drop handlers ── */
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverCol(colId);
    };

    const handleDragLeave = () => {
        setDragOverCol(null);
    };

    const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            updateTaskStatus(taskId, colId);
        }
        setDragOverCol(null);
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div>
                {/* ── Header ── */}
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
                            {[{ i: "S", c: "bg-primary" }, { i: "M", c: "bg-amber-500" }, { i: "J", c: "bg-blue-500" }].map((a, idx) => (
                                <div key={idx} className={cn("size-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold text-white", a.c)}>
                                    {a.i}
                                </div>
                            ))}
                        </div>

                        {/* Filter / Options button (matching LEA design) */}
                        <button className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                            <SlidersHorizontal size={16} />
                        </button>

                        <button
                            onClick={openNewTaskModal}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20"
                        >
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>
                </div>

                {/* ── Board Grid: 4 kanban columns + Activity sidebar ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_280px] gap-5">
                    {/* Kanban Columns */}
                    {columns.map((col) => {
                        const colTasks = getTasksByStatus(col.id);
                        const isDone = col.id === "done";
                        const isDropTarget = dragOverCol === col.id;
                        return (
                            <div
                                key={col.id}
                                className="flex flex-col min-w-0"
                                onDragOver={(e) => handleDragOver(e, col.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, col.id)}
                            >
                                {/* Column header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("size-2 rounded-full", col.dotColor)} />
                                        <span className="text-xs font-semibold text-foreground">{col.label}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {colTasks.length}
                                        </span>
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                        <MoreHorizontal size={14} />
                                    </button>
                                </div>

                                {/* Cards container with drop zone highlight */}
                                <div className={cn(
                                    "flex flex-col gap-3 flex-1 min-h-[200px] rounded-xl p-1 transition-all duration-200",
                                    isDropTarget && "bg-primary/5 border-2 border-dashed border-primary/30",
                                    !isDropTarget && "border-2 border-transparent"
                                )}>
                                    {colTasks.map((task) => {
                                        const catColor = CATEGORY_COLORS[task.category || "design"] || CATEGORY_COLORS.design;
                                        const avatarColor = ASSIGNEE_COLORS[task.assignee || "S"] || "bg-muted";
                                        return (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={() => openEditTaskModal(task)}
                                                className={cn(
                                                    "bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer",
                                                    isDone && "opacity-60"
                                                )}
                                            >
                                                {/* Drag handle + Category badge */}
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={14} className="text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0" />
                                                        {task.category && (
                                                            <span className={cn(
                                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md inline-block",
                                                                catColor.bg, catColor.text
                                                            )}>
                                                                {task.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h4 className={cn(
                                                    "text-sm font-semibold text-foreground leading-snug",
                                                    isDone && "line-through",
                                                    task.description ? "mb-1" : "mb-3"
                                                )}>
                                                    {task.text}
                                                </h4>

                                                {/* Description */}
                                                {task.description && (
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {/* Footer: metadata + assignee */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-muted-foreground">
                                                        {/* Due date */}
                                                        {task.dueDate && (
                                                            <span className="flex items-center gap-1 text-[10px] font-medium">
                                                                <Calendar size={11} />
                                                                {task.dueDate}
                                                            </span>
                                                        )}
                                                        {/* Comment count */}
                                                        {(task.commentCount !== undefined && task.commentCount > 0) && (
                                                            <span className="flex items-center gap-1 text-[10px] font-medium">
                                                                <MessageSquare size={11} />
                                                                {task.commentCount}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        {/* Delete (hover reveal) */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>

                                                        {/* Assignee avatar */}
                                                        {task.assignee && (
                                                            <div className={cn(
                                                                "size-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white",
                                                                avatarColor
                                                            )}>
                                                                {task.assignee}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* ── Add card: dashed border button (LEA style) ── */}
                                    {addingTo === col.id ? (
                                        <div className="bg-card rounded-xl border border-primary/30 p-3 shadow-sm">
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
                                                    className="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold hover:brightness-110 transition-all"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => setAddingTo(null)}
                                                    className="px-3 py-1 text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingTo(col.id)}
                                            className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 text-xs font-medium transition-all"
                                        >
                                            <Plus size={14} />
                                            Add card
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Sidebar: Activity Feed + Sprint Goal ── */}
                    <div className="space-y-5">
                        {/* Activity Feed */}
                        <div className="bg-card rounded-2xl border border-border p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {PLACEHOLDER_ACTIVITY.map((activity, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={cn("size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5", activity.color)}>
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

            {/* ── Task Modal ── */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={editingTask}
                onSave={handleModalSave}
                onDelete={editingTask ? () => deleteTask(editingTask.id) : undefined}
            />
        </div>
    );
}
