"use client";

import React, { createContext, useContext, ReactNode } from "react";

// In the future, this would integrate with NextAuth or Supabase Auth.
type User = {
    id: string;
    role: "guest" | "authenticated";
    name: string;
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Stubbed 'Guest' logic out of the box
    const mockUser: User = {
        id: "guest-123",
        role: "guest",
        name: "Guest User",
    };

    return (
        <AuthContext.Provider value={{ user: mockUser, isLoading: false }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
