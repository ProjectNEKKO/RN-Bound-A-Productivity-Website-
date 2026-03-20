"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, MoreHorizontal, SlidersHorizontal, Calendar, MessageSquare, X, GripVertical, ChevronDown, FolderPlus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, TaskStatus, Task, Project } from "@/store/useStore";

/* ─── Seed Tasks — pre-populate the board on first load ─── */
const SEED_TASKS: Omit<Task, "id" | "projectId">[] = [
    { text: "Create brand guidelines for mobile app", description: "Define typography, color palette, and component spacing for the world.", status: "todo", completed: false, category: "design", dueDate: "Oct 24", commentCount: 0 },
    { text: "Social media assets for launch", description: "", status: "todo", completed: false, category: "marketing", dueDate: "High Priority", commentCount: 0 },
    { text: "API integration for dashboard heroic boxes", description: "Full stack", status: "inProgress", completed: false, category: "dev", dueDate: "", commentCount: 2 },
    { text: "Figma Component Library Update", description: "", status: "inProgress", completed: false, category: "design", dueDate: "14 Storybes", commentCount: 0 },
    { text: "Landing page copy review", description: "Review all landing page sections and finalise wording.", status: "review", completed: false, category: "marketing", dueDate: "Oct 28", commentCount: 1 },
    { text: "Accessibility audit report", description: "Run WCAG 2.1 AA audit on all public-facing pages.", status: "review", completed: false, category: "research", dueDate: "Nov 1", commentCount: 0 },
    { text: "Onboarding flow illustrations", description: "Final set of 5 illustrations delivered.", status: "done", completed: true, category: "design", dueDate: "Oct 18", commentCount: 3 },
];

/* ─── Category badge colors ─── */
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    design: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-600" },
    research: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600" },
    marketing: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600" },
    dev: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600" },
};

/* ─── Category options ─── */
const CATEGORY_OPTIONS = ["design", "research", "marketing", "dev"];



/* ─── All 4 columns including Done ─── */
const columns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: "todo", label: "To Do", dotColor: "bg-pink-500" },
    { id: "inProgress", label: "In Progress", dotColor: "bg-blue-500" },
    { id: "review", label: "Review", dotColor: "bg-amber-500" },
    { id: "done", label: "Done", dotColor: "bg-emerald-500" },
];

/* ═══════════════════════════════════════════════════════════════
   Task Modal Component
   ═══════════════════════════════════════════════════════════════ */
function TaskModal({
    isOpen,
    onClose,
    task,
    onSave,
    onDelete,
}: {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (data: { text: string; description: string; status: TaskStatus; category: string; dueDate: string }) => void;
    onDelete?: () => void;
}) {
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("todo");
    const [category, setCategory] = useState("design");
    const [dueDate, setDueDate] = useState("");
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (task) {
                setText(task.text);
                setDescription(task.description || "");
                setStatus(task.status);
                setCategory(task.category || "design");
                setDueDate(task.dueDate || "");
            } else {
                setText("");
                setDescription("");
                // Status is pre-populated via props or remains 'todo'
                setCategory("design");
                setDueDate("");
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
        onSave({ text: text.trim(), description: description.trim(), status, category, dueDate: dueDate.trim() });
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
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                        {isEditing ? "Edit Task" : "New Task"}
                    </h2>
                    <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subject</label>
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs to be done?" autoFocus
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details about this task..." rows={3}
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer">
                                {columns.map((col) => (
                                    <option key={col.id} value={col.id}>{col.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer">
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Due Date</label>
                            <input type="text" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="e.g. Oct 24"
                                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            {isEditing && onDelete && (
                                <button type="button" onClick={() => { onDelete(); onClose(); }}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                    <Trash2 size={14} /> Delete
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-5 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20">
                                {isEditing ? "Save Changes" : "Create Task"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   New Project Modal Component
   ═══════════════════════════════════════════════════════════════ */
export function NewProjectModal({
    isOpen,
    onClose,
    onSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description?: string) => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) { setName(""); setDescription(""); }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(name.trim(), description.trim() || undefined);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) onClose();
    };

    return (
        <div ref={backdropRef} onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">New Project</h2>
                    <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Project Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Website Redesign" autoFocus
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description <span className="normal-case text-muted-foreground/60">(optional)</span></label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this project about?" rows={2}
                            className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">Cancel</button>
                        <button type="submit"
                            className="px-5 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Project Selector Dropdown
   ═══════════════════════════════════════════════════════════════ */
function ProjectSelector({
    projects,
    activeProjectId,
    onSelect,
    onNewProject,
    onDeleteProject,
}: {
    projects: Project[];
    activeProjectId: string | null;
    onSelect: (id: string) => void;
    onNewProject: () => void;
    onDeleteProject: (id: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const activeProject = projects.find(p => p.id === activeProjectId);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-all text-primary font-medium text-sm"
            >
                {activeProject?.name || "Select Project"}
                <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-border">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">Projects</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-all",
                                    project.id === activeProjectId
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted text-foreground"
                                )}
                                onClick={() => { onSelect(project.id); setIsOpen(false); }}
                            >
                                <div className="min-w-0">
                                    <span className="text-sm font-medium truncate block">{project.name}</span>
                                    {project.description && (
                                        <span className="text-[10px] text-muted-foreground truncate block">{project.description}</span>
                                    )}
                                </div>
                                {projects.length > 1 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-1 border-t border-border">
                        <button
                            onClick={() => { onNewProject(); setIsOpen(false); }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                            <FolderPlus size={14} />
                            New Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Main TaskRegistry Component
   ═══════════════════════════════════════════════════════════════ */
export function TaskRegistry() {
    const { tasks, addTask, deleteTask, updateTaskStatus, updateTask, projects, activeProjectId, addProject, deleteProject, setActiveProject } = useStore();

    /* ── Modal state ── */
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    /* ── Drag state ── */
    const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

    /* Seed the board with a default project and sample tasks on first load */
    const seeded = useRef(false);
    useEffect(() => {
        if (projects.length === 0 && !seeded.current) {
            seeded.current = true;
            const projectId = addProject("Q4 Product Launch", "Complete all mobile designs and handoff for development");
            const seedTasks: Task[] = SEED_TASKS.map((t) => ({
                ...t,
                id: crypto.randomUUID(),
                projectId,
            }));
            useStore.setState({ tasks: seedTasks });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeProject = projects.find(p => p.id === activeProjectId);
    const activeTasks = tasks.filter(t => t.projectId === activeProjectId);

    /* ── Modal handlers ── */
    const getTasksByStatus = (status: TaskStatus) => activeTasks.filter(t => t.status === status);

    const openNewTaskModal = (initialStatus?: TaskStatus) => {
        setEditingTask(initialStatus ? { ...SEED_TASKS[0], text: "", description: "", dueDate: "", id: "", projectId: activeProjectId!, status: initialStatus, completed: initialStatus === "done" } : null);
        setIsTaskModalOpen(true);
    };
    const openEditTaskModal = (task: Task) => { setEditingTask(task); setIsTaskModalOpen(true); };

    const handleModalSave = (data: { text: string; description: string; status: TaskStatus; category: string; dueDate: string }) => {
        if (editingTask && editingTask.id !== "") {
            updateTask(editingTask.id, {
                text: data.text, description: data.description, status: data.status,
                category: data.category, dueDate: data.dueDate,
                completed: data.status === "done",
            });
        } else {
            addTask(data.text, data.status, data.category, data.description, data.dueDate);
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

    const handleDragLeave = () => { setDragOverCol(null); };

    const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) updateTaskStatus(taskId, colId);
        setDragOverCol(null);
    };

    /* ── No project selected state ── */
    if (!activeProjectId || projects.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                    <FolderPlus size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">No Projects Yet</h2>
                    <p className="text-sm text-muted-foreground mb-6">Create your first project to start managing tasks.</p>
                    <button
                        onClick={() => setIsProjectModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20 mx-auto"
                    >
                        <Plus size={16} />
                        Create Project
                    </button>
                    <NewProjectModal
                        isOpen={isProjectModalOpen}
                        onClose={() => setIsProjectModalOpen(false)}
                        onSave={(name, desc) => addProject(name, desc)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div>
                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-6">
                    <div>

                        <h1 className="text-2xl font-bold text-foreground">
                            {activeProject?.name || "Project Tasks"}
                        </h1>
                        {activeProject?.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{activeProject.description}</p>
                        )}
                        </div>
                    <div className="flex items-center gap-3">
                        <button className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                            <SlidersHorizontal size={16} />
                        </button>

                        <button
                            onClick={() => openNewTaskModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20"
                        >
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>
                </div>

                {/* ── Board Grid: 4 full-width kanban columns ── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
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
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical size={14} className="text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0" />
                                                        {task.category && (
                                                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md inline-block", catColor.bg, catColor.text)}>
                                                                {task.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <h4 className={cn("text-sm font-semibold text-foreground leading-snug", isDone && "line-through", task.description ? "mb-1" : "mb-3")}>
                                                    {task.text}
                                                </h4>

                                                {task.description && (
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">{task.description}</p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-muted-foreground">
                                                        {task.dueDate && (
                                                            <span className="flex items-center gap-1 text-[10px] font-medium">
                                                                <Calendar size={11} />{task.dueDate}
                                                            </span>
                                                        )}
                                                        {(task.commentCount !== undefined && task.commentCount > 0) && (
                                                            <span className="flex items-center gap-1 text-[10px] font-medium">
                                                                <MessageSquare size={11} />{task.commentCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* ── Add card directly via Modal ── */}
                                    <button onClick={() => openNewTaskModal(col.id)}
                                        className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 text-xs font-medium transition-all">
                                        <Plus size={14} /> Add card
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Task Modal ── */}
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                task={editingTask}
                onSave={handleModalSave}
                onDelete={editingTask ? () => deleteTask(editingTask.id) : undefined}
            />

            {/* ── New Project Modal ── */}
            <NewProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSave={(name, desc) => addProject(name, desc)}
            />
        </div>
    );
}
