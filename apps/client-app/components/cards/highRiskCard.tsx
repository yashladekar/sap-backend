import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ArrowDownRight, ArrowUpRight, Shield } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

export function HighRiskCard({
  count = 12,
  delta = "-3.27",
}: {
  count?: number;
  delta?: string;
}) {
  const isPositive = delta.startsWith("+");
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  // keep original light-mode classes exactly; add dark: variants only
  const deltaBadgeColor = isPositive
    ? "bg-red-300 text-red-800 dark:bg-red-900 dark:text-red-200"
    : "bg-green-300 text-green-800 dark:bg-green-900 dark:text-green-200";

  return (
    <Card
      className={cn(
        // original light-mode gradient preserved
        "w-full max-w-sm gap-2 bg-linear-to-br from-gray-300 to-white shadow-none",
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
          High Risk Systems
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-200 dark:bg-orange-900/30">
          <Shield className="h-4 w-4 text-orange-600 dark:text-orange-300" />
        </div>
      </CardHeader>

      <CardContent className="space-y-0.5 px-4">
        <div className="w-full pt-2">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {count}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1 px-2 py-1",
                deltaBadgeColor
              )}
            >
              <DeltaIcon className="h-4 w-4" />
              <span className="text-xs font-semibold">{delta}%</span>
            </Badge>
          </div>
        </div>

        <Separator className="bg-accent-foreground/5 dark:bg-slate-700" />

        <div className="flex justify-between gap-1 text-xs font-semibold">
          <span className="text-zinc-500 dark:text-slate-400">
            view details
          </span>
          <span className="text-zinc-400 dark:text-slate-600">•</span>
          <span className="text-zinc-500 dark:text-slate-400">take action</span>
        </div>
      </CardContent>
    </Card>
  );
}
