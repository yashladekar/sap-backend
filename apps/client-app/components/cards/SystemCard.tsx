"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { LucideIcon, TriangleAlert, Timer, ShieldCheck } from "lucide-react";
import SystemDetailsDialog from "./systemDetailsDialog";

export type SystemStatus = "Critical" | "Warning" | "Protected";

interface SystemCardProps {
  icon: LucideIcon;
  title: string;
  status: SystemStatus;
  version: string;
  vulnerabilities: number;
  lastPatch: string;
}

/**
 * Status config includes both light and dark mode classes.
 * Keep the same keys so the rest of the component is unchanged.
 */
const statusConfig = {
  Critical: {
    icon: TriangleAlert,
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800",
    vulnerabilityClass: "text-red-700 dark:text-red-300 font-semibold",
  },
  Warning: {
    icon: Timer,
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800",
    vulnerabilityClass: "text-yellow-700 dark:text-yellow-300 font-semibold",
  },
  Protected: {
    icon: ShieldCheck,
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800",
    vulnerabilityClass: "text-green-700 dark:text-green-300 font-semibold",
  },
};

export function SystemCard({
  icon: Icon,
  title,
  status,
  version,
  vulnerabilities,
  lastPatch,
}: SystemCardProps) {
  const config = statusConfig[status];
  const BadgeIcon = config.icon;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className={cn(
          "w-full max-w-sm gap-2 py-4",
          // light / dark card surface and subtle border
          "bg-white dark:bg-slate-800",
          "border border-transparent dark:border-transparent",
          // subtle shadow and rounded corners for a professional look
          "shadow-sm dark:shadow-none",
          "rounded-lg"
        )}
      >
        <CardHeader className="px-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <CardTitle className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {title}
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 px-2 text-xs font-semibold",
                // status-specific badge classes already include dark variants
                config.badgeClass
              )}
            >
              <BadgeIcon className="h-3.5 w-3.5" />
              {status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-y-2 text-xs pb-2 px-4">
          <span className="text-slate-500 dark:text-slate-400">Version:</span>
          <span className="font-medium text-right text-slate-700 dark:text-slate-100">
            {version}
          </span>

          <span className="text-slate-500 dark:text-slate-400">
            Vulnerabilities:
          </span>
          <span
            className={cn(
              "font-medium text-right",
              // vulnerabilityClass includes dark variants
              config.vulnerabilityClass
            )}
          >
            {vulnerabilities}
          </span>

          <span className="text-slate-500 dark:text-slate-400">
            Last Patch:
          </span>
          <span className="font-medium text-right text-slate-700 dark:text-slate-100">
            {lastPatch}
          </span>
        </CardContent>

        <CardFooter className="px-4">
          <Button
            variant="secondary"
            className="w-full text-xs cursor-pointer"
            size={"sm"}
            onClick={() => setOpen(true)}
          >
            Know More
          </Button>
        </CardFooter>
      </Card>

      <SystemDetailsDialog
        open={open}
        onOpenChange={setOpen}
        icon={Icon}
        title={title}
        status={status}
        version={version}
        vulnerabilities={vulnerabilities}
        lastPatch={lastPatch}
      />
    </>
  );
}
