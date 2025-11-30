"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Calendar,
  Download,
  Search,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";


function generateMockData(systemName: string) {
  const seed = Array.from(systemName || "default").reduce(
    (s, c) => s + c.charCodeAt(0),
    0
  );

  const vulnCount = (seed % 15) + 5;
  const types = [
    "SQL injection",
    "Cross-site scripting",
    "Privilege escalation",
    "Remote code execution",
    "Authentication bypass",
    "Information disclosure",
  ];

  const vulnerabilities = Array.from({ length: vulnCount }).map((_, i) => ({
    id: `CVE-2024-${(seed + i).toString().padStart(4, "0")}`,
    title: types[(seed + i) % types.length],
    severity: i % 4 === 0 ? "Critical" : i % 3 === 0 ? "High" : "Medium",
    status: i % 5 === 0 ? "Patched" : "Open",
    detected: new Date(2024, 0, 1 + i * 3).toLocaleDateString(),
  }));

  const historyData = [
    { name: "Jan", vulns: Math.max(2, (seed % 5) + 2) },
    { name: "Feb", vulns: Math.max(3, (seed % 6) + 1) },
    { name: "Mar", vulns: Math.max(1, (seed % 4) + 4) },
    { name: "Apr", vulns: Math.max(4, (seed % 7) + 2) },
    { name: "May", vulns: Math.max(2, (seed % 3) + 5) },
    { name: "Jun", vulns: vulnCount },
  ];

  const severityCounts = {
    Critical: vulnerabilities.filter((v) => v.severity === "Critical").length,
    High: vulnerabilities.filter((v) => v.severity === "High").length,
    Medium: vulnerabilities.filter((v) => v.severity === "Medium").length,
    Low: vulnerabilities.filter((v) => v.severity === "Low").length,
  };

  const chartData = [
    { name: "Critical", count: severityCounts.Critical, fill: "#ef4444" },
    { name: "High", count: severityCounts.High, fill: "#f97316" },
    { name: "Medium", count: severityCounts.Medium, fill: "#eab308" },
    { name: "Low", count: severityCounts.Low, fill: "#22c55e" },
  ];

  return { vulnerabilities, historyData, chartData, severityCounts };
}


export default function SystemDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const systemName = searchParams.get("system") || "Unknown System";

  const { vulnerabilities, historyData, chartData, severityCounts } = useMemo(
    () => generateMockData(systemName),
    [systemName]
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          {/* Back Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/dashboard"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <span>/</span>
            <span>System Details</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {systemName}
          </h1>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-500">
              Version 2.4.1
            </Badge>
            <Badge
              className={cn(
                "bg-red-100 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
              )}
            >
              Critical Status
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button size="sm" className="bg-slate-900 dark:bg-slate-50">
            Run Manual Scan
          </Button>
        </div>
      </div>

      <Separator />

      {/* --- KPI Cards --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vulnerabilities
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vulnerabilities.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Issues
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{severityCounts.Critical}</div>
            <p className="text-xs text-muted-foreground">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Score
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">C-</div>
            <p className="text-xs text-muted-foreground">
              Degraded due to CVEs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Patch</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Days ago</div>
            <p className="text-xs text-muted-foreground">
              Patch applied automatically
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Severity Distribution Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>
              Breakdown of current active threats by severity level.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#88888820"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Historical Trend Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vulnerability Trends</CardTitle>
            <CardDescription>
              Detected vulnerabilities over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorVulns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#88888820"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vulns"
                    stroke="#0ea5e9"
                    fillOpacity={1}
                    fill="url(#colorVulns)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Detailed Table Section --- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Identified Vulnerabilities</CardTitle>
            <CardDescription>
              A detailed list of all CVEs affecting {systemName}.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Search className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Search
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">CVE ID</TableHead>
                <TableHead>Vulnerability Name</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vulnerabilities.map((vuln) => (
                <TableRow key={vuln.id}>
                  <TableCell className="font-medium font-mono text-xs text-slate-500">
                    {vuln.id}
                  </TableCell>
                  <TableCell>{vuln.title}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {vuln.detected}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        vuln.severity === "Critical"
                          ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20"
                          : vuln.severity === "High"
                            ? "border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      )}
                    >
                      {vuln.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {vuln.status === "Patched" ? (
                      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <ShieldCheck className="h-3 w-3" /> Patched
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                        <ShieldAlert className="h-3 w-3" /> Open
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      Remediate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
