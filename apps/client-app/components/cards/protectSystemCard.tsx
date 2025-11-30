"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight, ArrowDownRight, ShieldCheck } from "lucide-react";
import { type ChartConfig, ChartContainer } from "@workspace/ui/components/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { cn } from "@workspace/ui/lib/utils";

const chartConfig = {
  capacity: {
    label: "Protected",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ProtectedSystemsCard({
  protectedCount = 156,
  total = 200,
  delta = "+8.63",
}: {
  protectedCount?: number;
  total?: number;
  delta?: string;
}) {
  const percentage = total > 0 ? Math.round((protectedCount / total) * 100) : 0;

  const chartData = [
    {
      name: "protected",
      capacity: percentage,
      fill: "var(--primary)",
    },
  ];

  const isPositive = delta.startsWith("+");
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const deltaBadgeColor = isPositive
    ? "bg-green-300 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-300 text-red-800 dark:bg-red-900 dark:text-red-200";

  return (
    <Card
      className={cn(
        // original light-mode preserved
        "w-full max-w-sm gap-0 bg-linear-to-br from-gray-300 to-white shadow-none",
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
          Systems Protected
        </CardTitle>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-200",
            "dark:bg-blue-900/30"
          )}
        >
          <ShieldCheck className="h-4 w-4 text-blue-500 dark:text-blue-300" />
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="flex w-full items-center justify-between pt-2">
          <div className="relative shrink-0 flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-14 w-14">
              <RadialBarChart
                data={chartData}
                innerRadius={22}
                outerRadius={28}
                barSize={6}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                  axisLine={false}
                />
                <RadialBar
                  dataKey="capacity"
                  background
                  cornerRadius={10}
                  fill="var(--primary)"
                  angleAxisId={0}
                />
              </RadialBarChart>
            </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="text-xl font-bold pr-6 text-slate-900 dark:text-slate-100">
            {protectedCount}/{total}
          </div>

          <Badge
            variant="secondary"
            className={cn("flex items-center gap-1 py-1", deltaBadgeColor)}
          >
            <DeltaIcon className="h-4 w-4" />
            <span className="text-xs font-semibold">{delta}%</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
