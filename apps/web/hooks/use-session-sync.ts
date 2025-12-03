"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "@/lib/auth-client";

const SESSION_SYNC_KEY = "auth_session_sync";
const SESSION_CHECK_INTERVAL = 5000; // Check every 5 seconds

interface SessionSyncEvent {
    type: "login" | "logout" | "session_changed";
    userId?: string;
    timestamp: number;
}

/**
 * Hook to synchronize auth session across tabs and apps
 * When a user logs in/out in one tab, other tabs will detect and react
 */
export function useSessionSync() {
    const router = useRouter();
    const lastSessionRef = useRef<string | null>(null);
    const isLoggingOutRef = useRef(false);

    // Broadcast session change to other tabs
    const broadcastSessionChange = useCallback((event: SessionSyncEvent) => {
        try {
            // Use localStorage for cross-tab communication (works across same origin)
            localStorage.setItem(SESSION_SYNC_KEY, JSON.stringify(event));
            // Immediately remove to trigger storage event
            localStorage.removeItem(SESSION_SYNC_KEY);
        } catch {
            // localStorage might not be available
        }
    }, []);

    // Handle logout
    const handleLogout = useCallback(async () => {
        if (isLoggingOutRef.current) return;
        isLoggingOutRef.current = true;

        try {
            await signOut();
            broadcastSessionChange({ type: "logout", timestamp: Date.now() });
            router.push("/sign-in");
        } finally {
            isLoggingOutRef.current = false;
        }
    }, [broadcastSessionChange, router]);

    // Check session validity by polling the API
    const checkSession = useCallback(async () => {
        try {
            const session = await getSession();
            const currentUserId = session?.data?.user?.id ?? null;

            // Session changed
            if (lastSessionRef.current !== null && currentUserId !== lastSessionRef.current) {
                if (!currentUserId) {
                    // User was logged in but now logged out (from another tab/app)
                    router.push("/sign-in");
                } else if (lastSessionRef.current === null) {
                    // User was logged out but now logged in
                    router.refresh();
                } else {
                    // Different user logged in - force logout and redirect
                    router.push("/sign-in");
                }
            }

            lastSessionRef.current = currentUserId;
        } catch {
            // Session check failed - might be network issue, don't logout
        }
    }, [router]);

    useEffect(() => {
        // Initialize session state
        checkSession();

        // Listen for storage events (cross-tab communication)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === SESSION_SYNC_KEY && event.newValue) {
                try {
                    const syncEvent: SessionSyncEvent = JSON.parse(event.newValue);

                    if (syncEvent.type === "logout") {
                        // Another tab logged out - redirect to login
                        router.push("/sign-in");
                    } else if (syncEvent.type === "login" || syncEvent.type === "session_changed") {
                        // Session changed - refresh to get new state
                        router.refresh();
                    }
                } catch {
                    // Invalid event
                }
            }
        };

        // Listen for visibility change to check session when tab becomes active
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkSession();
            }
        };

        // Listen for focus to check session when window gains focus
        const handleFocus = () => {
            checkSession();
        };

        window.addEventListener("storage", handleStorageChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);

        // Poll session periodically (catches cross-origin session changes)
        const intervalId = setInterval(checkSession, SESSION_CHECK_INTERVAL);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            clearInterval(intervalId);
        };
    }, [checkSession, router]);

    return {
        broadcastSessionChange,
        handleLogout,
        checkSession,
    };
}
