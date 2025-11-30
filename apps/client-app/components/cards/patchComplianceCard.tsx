"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";

export function PatchComplianceCard({
  value = 78,
  delta = "+5.08%",
}: {
  value?: number;
  delta?: string;
}) {
  const isPositive = delta.startsWith("+");
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const deltaBadgeColor = isPositive
    ? "bg-green-300 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-300 text-red-800 dark:bg-red-900 dark:text-red-200";

  return (
    <Card
      className={cn(
        // original light-mode preserved
        "w-full max-w-sm gap-1 bg-linear-to-br from-gray-300 to-white shadow-none",
        // dark-mode surface helpers only
        "dark:bg-slate-800 dark:from-slate-800 dark:to-slate-900 dark:shadow-sm dark:rounded-lg"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 px-4">
        <CardTitle
          className={cn(
            "text-base font-semibold text-zinc-500 dark:text-slate-200"
          )}
        >
          Patch Compliance
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-200 dark:bg-green-900/30">
          <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-300" />
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="w-full pt-2">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {value}%
            </div>

            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1 px-2 py-1",
                deltaBadgeColor
              )}
            >
              <DeltaIcon className="h-4 w-4" />
              <span className="text-xs font-semibold">{delta}</span>
            </Badge>
          </div>
          <Progress
            value={value}
            aria-label={`${value}% Patch Compliance`}
            className="h-2 w-full mt-2 bg-slate-200 dark:bg-slate-700"
          />
        </div>
      </CardContent>
    </Card>
  );
}
