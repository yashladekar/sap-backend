"use client";

import { useCallback, useState } from "react";
import { Bell, CheckCheck, Clock, Inbox, Settings, Trash2 } from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet";

interface Notification {
  notificationId: string;
  user?: { name: string; avatar?: string };
  type?: "message" | "system" | "invite";
  message: string;
  time: string;
  seen: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    notificationId: "n-1",
    user: { name: "Asha" },
    type: "message",
    message: "commented on the Apollo Project report.",
    time: new Date().toISOString(),
    seen: false,
  },
  {
    notificationId: "n-2",
    user: { name: "System" },
    type: "system",
    message: "Your password will expire in 3 days.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    seen: false,
  },
  {
    notificationId: "n-3",
    user: { name: "Ravi" },
    type: "invite",
    message: "invited you to the 'Design Sync' channel.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    seen: true,
  },
  {
    notificationId: "n-4",
    user: { name: "System" },
    type: "system",
    message: "Backup completed successfully.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    seen: true,
  },
];

const NotificationBell = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.seen).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.seen;
    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  }, []);

  const markAsSeen = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, seen: true } : n))
    );
  }, []);

  const removeNotification = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
  }, []);

  const simulateIncoming = () => {
    const id = `n-${Date.now()}`;
    const newNotification: Notification = {
      notificationId: id,
      user: { name: "New User" },
      type: "message",
      message: "just signed up for a demo.",
      time: new Date().toISOString(),
      seen: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-orange-400 to-pink-600",
      "from-blue-400 to-indigo-600",
      "from-emerald-400 to-teal-600",
      "from-purple-400 to-violet-600",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* Reduced max-width to 380px for a tighter sheet */}
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-[380px] gap-0">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col">
            <SheetTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Notifications
            </SheetTitle>
            <SheetDescription className="text-[11px] text-slate-500 font-medium">
              You have {unreadCount} unread messages
            </SheetDescription>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("all")}
                className={clsx(
                  "pb-1.5 text-xs font-semibold transition-all relative",
                  activeTab === "all"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                All
                {activeTab === "all" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={clsx(
                  "pb-1.5 text-xs font-semibold transition-all relative",
                  activeTab === "unread"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                Unread
                {activeTab === "unread" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  />
                )}
              </button>
            </div>

            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 px-2.5 h-6 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Mark as all read</span>
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 py-2">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={n.notificationId}
                  onClick={() => !n.seen && markAsSeen(n.notificationId)}
                  className={clsx(
                    "group relative flex gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer border",
                    !n.seen
                      ? "bg-slate-50 border-indigo-100 shadow-sm dark:bg-slate-900/60 dark:border-indigo-900/50"
                      : "bg-white border-slate-100 hover:border-slate-200 dark:bg-transparent dark:border-transparent dark:hover:bg-slate-900/30"
                  )}
                >
                  {/* Left Indicator Strip for Unread */}
                  {!n.seen && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-500" />
                  )}

                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5 pl-1.5">
                    {n.user?.name === "System" ? (
                      <div className="h-8 w-8 rounded-full bg-slate-400 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <Settings className="w-3.5 h-3.5 text-slate-200" />
                      </div>
                    ) : (
                      <div
                        className={clsx(
                          "h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm bg-linear-to-br",
                          getAvatarColor(n.user?.name || "U")
                        )}
                      >
                        {n.user?.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {n.user?.name}
                      </p>

                      {/* Stylish Time Badge */}
                      <span className="shrink-0 text-[9px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                        {formatTimestamp(n.time)}
                      </span>
                    </div>

                    <p
                      className={clsx(
                        "text-xs leading-relaxed",
                        !n.seen
                          ? "text-slate-700 dark:text-slate-300 font-medium"
                          : "text-slate-500 dark:text-slate-500"
                      )}
                    >
                      {n.message}
                    </p>
                  </div>

                  {/* Hover Action */}
                  <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md"
                      onClick={(e) => removeNotification(n.notificationId, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              // ... (Empty state code remains the same)
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-48 text-center px-4"
              >
                {/* ... */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <Button
            variant="outline"
            className="w-full text-xs h-8 gap-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
            onClick={() => {
              setNotifications([]);
            }}
          >
            <Trash2 className="w-3 h-3" />
            Clear All History
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
