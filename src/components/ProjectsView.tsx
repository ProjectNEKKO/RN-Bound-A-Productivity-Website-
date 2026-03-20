"use client";

import { useState } from "react";
import { Plus, Folder, FolderOpen, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { NewProjectModal } from "./TaskRegistry";
import { cn } from "@/lib/utils";

export function ProjectsView() {
    const { projects, activeProjectId, setActiveProject, setActiveView, deleteProject, addProject, tasks } = useStore();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    const handleProjectClick = (id: string) => {
        setActiveProject(id);
        setActiveView("tasks");
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your spaces and get to work.</p>
                </div>
                <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all shadow-sm shadow-primary/20"
                >
                    <Plus size={18} />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id);
                    const completedTasks = projectTasks.filter(t => t.status === "done").length;
                    const totalTasks = projectTasks.length;
                    
                    return (
                        <div
                            key={project.id}
                            onClick={() => handleProjectClick(project.id)}
                            className={cn(
                                "group relative flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer",
                                activeProjectId === project.id ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:border-primary/50"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-muted rounded-xl text-primary group-hover:scale-110 transition-transform">
                                    {activeProjectId === project.id ? <FolderOpen size={24} /> : <Folder size={24} />}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">{project.name}</h3>
                                {project.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                                <span className="text-muted-foreground font-medium">
                                    {totalTasks} Task{totalTasks !== 1 ? 's' : ''}
                                </span>
                                {totalTasks > 0 && (
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-bold">
                                        {Math.round((completedTasks / totalTasks) * 100)}% Done
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border p-6 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer min-h-[220px]"
                >
                    <div className="bg-muted p-4 rounded-full">
                        <Plus size={24} />
                    </div>
                    <span className="font-semibold text-lg">Create New Project</span>
                </button>
            </div>

            <NewProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSave={(name, desc) => addProject(name, desc)}
            />
        </div>
    );
}
