"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSessionSync } from "@/hooks/use-session-sync";

interface SessionSyncContextType {
    broadcastSessionChange: (event: { type: "login" | "logout" | "session_changed"; userId?: string; timestamp: number }) => void;
    handleLogout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const SessionSyncContext = createContext<SessionSyncContextType | null>(null);

export function useSessionSyncContext() {
    const context = useContext(SessionSyncContext);
    if (!context) {
        throw new Error("useSessionSyncContext must be used within a SessionSyncProvider");
    }
    return context;
}

interface SessionSyncProviderProps {
    children: ReactNode;
}

/**
 * Provider that enables session synchronization across tabs and apps.
 * Wrap your app with this provider to enable auto-logout when session changes.
 */
export function SessionSyncProvider({ children }: SessionSyncProviderProps) {
    const sessionSync = useSessionSync();

    return (
        <SessionSyncContext.Provider value={sessionSync}>
            {children}
        </SessionSyncContext.Provider>
    );
}
