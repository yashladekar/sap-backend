"use client";

import { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { TriangleAlert, Timer, ShieldCheck } from "lucide-react";
import Link from "next/link";

export type SystemStatus = "Critical" | "Warning" | "Protected";

interface SystemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: LucideIcon;
  title: string;
  status: SystemStatus;
  version: string;
  vulnerabilities: number;
  lastPatch: string;
}

function generateDemoVulnerabilities(count: number, systemName: string) {
  const types = [
    "SQL injection",
    "Cross-site scripting",
    "Privilege escalation",
    "Remote code execution",
    "Authentication bypass",
    "Information disclosure",
    "Denial of service",
  ];
  const seed = Array.from(systemName).reduce((s, c) => s + c.charCodeAt(0), 0);
  const results: { id: string; title: string; severity: string }[] = [];
  for (let i = 0; i < count; i++) {
    const id = `CVE-2024-${(seed + i).toString().padStart(4, "0")}`;
    const title = `${types[(seed + i) % types.length]}`;
    const severity = i % 3 === 0 ? "Critical" : i % 3 === 1 ? "High" : "Medium";
    results.push({ id, title, severity });
  }
  return results;
}

const statusBadge = {
  Critical: {
    className: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200",
    icon: TriangleAlert,
  },
  Warning: {
    className:
      "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Timer,
  },
  Protected: {
    className:
      "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200",
    icon: ShieldCheck,
  },
};

export default function SystemDetailsDialog({
  open,
  onOpenChange,
  icon: Icon,
  title,
  status,
  version,
  vulnerabilities,
  lastPatch,
}: SystemDetailsDialogProps) {
  const demoVulns =
    vulnerabilities > 0
      ? generateDemoVulnerabilities(vulnerabilities, title)
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl bg-linear-to-t from-gray-300 to-white border-none dark:bg-slate-800 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
        <DialogHeader className="border-b border-gray-400 pb-2 dark:border-slate-700">
          <div className="flex gap-2 items-center">
            <DialogTitle className="text-xl font-bold italic text-slate-900 dark:text-slate-100">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-gray-500 dark:text-slate-400">
                Version:{" "}
                <span className="font-medium text-gray-700 dark:text-slate-200">
                  {version}
                </span>
              </span>
              <span className="text-gray-500 dark:text-slate-400">
                Last Patch:{" "}
                <span className="font-medium text-gray-700 dark:text-slate-200">
                  {lastPatch}
                </span>
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 text-xs">
          <section>
            <h4 className="font-bold text-xs text-gray-600 mb-2 italic dark:text-slate-300">
              System MetaData and the Vulnerabilities
            </h4>

            <div
              className={cn(
                "w-full",
                demoVulns.length === 0 ? "" : "rounded-md",
                demoVulns.length > 4 ? "max-h-48 overflow-y-auto pr-2 " : ""
              )}
            >
              {demoVulns.length === 0 ? (
                <div className="text-gray-600 dark:text-slate-400">
                  No known vulnerabilities detected for this system.
                </div>
              ) : (
                <div className="grid gap-2">
                  {demoVulns.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-md px-3 py-2 bg-accent dark:bg-accent/6"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {v.id} — {v.title}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-slate-400">
                          Affected component: {title}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={
                            v.severity === "Critical"
                              ? "text-red-600 font-bold text-xs dark:text-red-300"
                              : v.severity === "High"
                                ? "text-orange-600 font-semibold text-xs dark:text-orange-300"
                                : "text-yellow-700 text-xs dark:text-yellow-300"
                          }
                        >
                          {v.severity}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 dark:text-slate-400">
                          Remediation: Apply vendor patch or mitigate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <DialogFooter className="mt-2">
          <Link
            href={`/systemDetails?system=${encodeURIComponent(
              title
            )}`}
          >
            <Button
              onClick={() => {
                onOpenChange(false);
              }}
              className="text-xs cursor-pointer w-full"
              variant={"secondary"}
            >
              View in Details
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
