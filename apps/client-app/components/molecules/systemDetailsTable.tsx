"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  TriangleAlert,
  Timer,
  Search,
  PlusCircle,
  FilePenLine,
  Trash2,
  Check,
  X,
  CalendarIcon,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";

import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";

const systemsData = [
  {
    title: "SAP ECC 6.0",
    status: "Critical",
    version: "ECC 6.0 EHP8",
    vulnerabilities: 5,
    lastPatch: "2024-01-15",
  },
  {
    title: "SAP S/4HANA",
    status: "Warning",
    version: "2022 FPS02",
    vulnerabilities: 2,
    lastPatch: "2024-02-10",
  },
  {
    title: "SAP BW/4HANA",
    status: "Protected",
    version: "2023 FPS01",
    vulnerabilities: 0,
    lastPatch: "2024-02-28",
  },
  {
    title: "SAP Factors",
    status: "Protected",
    version: "Cloud Q1 2024",
    vulnerabilities: 0,
    lastPatch: "Auto-updated",
  },
];

type SystemStatus = "Critical" | "Warning" | "Protected";

export type SystemRow = {
  id: string;
  title: string;
  status: SystemStatus;
  version: string;
  vulnerabilities: number;
  lastPatch: string;
};

const STORAGE_KEY = "systems_vuln_table_v2";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

const STATUS_ICONS: Record<SystemStatus, React.ReactNode> = {
  Critical: <TriangleAlert className="w-4 h-4 text-red-600" />,
  Warning: <Timer className="w-4 h-4 text-yellow-600" />,
  Protected: <ShieldCheck className="w-4 h-4 text-green-600" />,
};

function parseDate(dateString: string): Date | undefined {
  const date = new Date(dateString);
  if (!isNaN(date.getTime()) && dateString !== "Auto-updated") {
    return date;
  }
  return undefined;
}

export default function SystemDetailsTable() {
  const [highlight, setHighlight] = useState<string | null>(null);
  const [rows, setRows] = useState<SystemRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<SystemRow>>({});
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setHighlight(params.get("system") ?? null);
    }
  }, []);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;

      if (raw) {
        const parsed = JSON.parse(raw) as SystemRow[];
        if (parsed.length > 0) {
          setRows(parsed);
          return;
        }
      }
    } catch { }

    const seeded = systemsData.map((s) => ({
      id: uid("s-"),
      title: s.title,
      status: s.status as SystemStatus,
      version: s.version,
      vulnerabilities: s.vulnerabilities,
      lastPatch: s.lastPatch,
    }));
    setRows(seeded);
  }, []);

  useEffect(() => {
    try {
      if (rows.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      }
    } catch { }
  }, [rows]);

  useEffect(() => {
    if (highlight) {
      const match = rows.find((r) => r.title === highlight);
      if (match) {
        setTimeout(() => {
          const el = document.getElementById(`system-row-${match.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.animate(
              [
                { boxShadow: "0 0 0 0 rgba(59,130,246,0.0)" },
                { boxShadow: "0 0 0 6px rgba(59,130,246,0.12)" },
              ],
              { duration: 600 }
            );
          }
        }, 150);
      }
    }
  }, [highlight, rows]);

  const filtered = useMemo(() => {
    if (!filter) return rows;
    const q = filter.toLowerCase();
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  function startEdit(row?: SystemRow) {
    if (row) {
      setDraft({ ...row });
      setEditingId(row.id);
    } else {
      const newRow: SystemRow = {
        id: uid("s-"),
        title: "",
        status: "Protected",
        version: "",
        vulnerabilities: 0,
        lastPatch: format(new Date(), "yyyy-MM-dd"),
      };
      setRows((p) => [newRow, ...p]);
      setDraft({ ...newRow });
      setEditingId(newRow.id);
    }
  }

  function cancelEdit(id: string) {
    const row = rows.find((r) => r.id === id);
    if (
      row &&
      row.title === "" &&
      row.version === "" &&
      row.vulnerabilities === 0
    ) {
      setRows((p) => p.filter((x) => x.id !== id));
    }
    setEditingId(null);
    setDraft({});
  }

  function saveEdit(id: string) {
    if (!draft.title || draft.title.trim().length === 0) {
      console.error("Title is required");
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...(r as SystemRow), ...(draft as SystemRow), id } : r
      )
    );
    setEditingId(null);
    setDraft({});
  }

  function deleteRow(id: string) {
    console.warn(`Deleting row ${id}. (Bypassed confirm)`);
    setRows((p) => p.filter((r) => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft({});
    }
  }

  return (
    <div className="border rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by title, status..."
              className="pl-8"
            />
          </div>
          <Button
            onClick={() => startEdit()}
            variant="default"
            size="sm"
            className="text-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add system
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Rows: <span className="font-medium">{rows.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-fit">System</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Vulnerabilities</TableHead>
              <TableHead>Last Patch</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  {filter
                    ? "No systems match your search."
                    : "No systems found."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => {
              const isEditing = editingId === row.id;
              const isHighlighted = highlight && highlight === row.title;

              const currentPatchString = (draft.lastPatch ??
                row.lastPatch) as string;

              const selectedDate = parseDate(currentPatchString);

              return (
                <TableRow
                  id={`system-row-${row.id}`}
                  key={row.id}
                  data-state={isHighlighted ? "selected" : undefined}
                  className={cn(isHighlighted ? "bg-blue-50" : "")}
                >
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input
                        value={(draft.title ?? "") as string}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        placeholder="System name"
                      />
                    ) : (
                      <>
                        <div className="font-medium">{row.title}</div>
                        <div className="text-[12px] text-gray-500 mt-1">
                          ID: {row.id}
                        </div>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={(draft.status ?? row.status) as SystemStatus}
                        onValueChange={(value) =>
                          setDraft((d) => ({
                            ...d,
                            status: value as SystemStatus,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="Warning">Warning</SelectItem>
                          <SelectItem value="Protected">Protected</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {STATUS_ICONS[row.status]}
                        <span className="text-sm">{row.status}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        className="w-28"
                        value={(draft.version ?? row.version) as string}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, version: e.target.value }))
                        }
                        placeholder="1.0.0"
                      />
                    ) : (
                      <div>{row.version}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        min={0}
                        className="w-20"
                        value={String(
                          draft.vulnerabilities ?? row.vulnerabilities
                        )}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            vulnerabilities: Number(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      <div>{row.vulnerabilities}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-60 justify-start text-left font-normal",
                              !currentPatchString && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "PPP")
                              : currentPatchString === "Auto-updated"
                                ? "Auto-updated"
                                : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) =>
                              setDraft((d) => ({
                                ...d,
                                lastPatch: date
                                  ? format(date, "yyyy-MM-dd")
                                  : "",
                              }))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {row.lastPatch}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => saveEdit(row.id)}
                          size="sm"
                          variant="secondary"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => cancelEdit(row.id)}
                          size="sm"
                          variant="ghost"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => startEdit(row)}
                          size="sm"
                          variant="secondary"
                        >
                          <FilePenLine className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteRow(row.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
