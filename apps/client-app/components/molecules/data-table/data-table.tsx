"use client";

import React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  CircleDot,
  MoreVertical,
  GripVertical,
  LayoutGrid,
  Loader,
  ShieldAlert,
  TriangleAlert,
  Shield,
  ShieldCheck,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export const schema = z.object({
  id: z.number(),
  CEVID: z.string(),
  Title: z.string(),
  severity: z.string(),
  cvss: z.number(),
  affectedSystems: z.array(z.string()),
  status: z.string(),
});

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground/50 hover:text-foreground h-8 w-8 hover:bg-muted"
    >
      <GripVertical className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    size: 40,
  },

  {
    accessorKey: "CEVID",
    header: "CEV ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs font-medium text-muted-foreground">
        {row.original.CEVID}
      </div>
    ),
  },
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[250px] flex-col gap-1">
          <span
            className="truncate font-medium text-foreground"
            title={row.original.Title}
          >
            {row.original.Title}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.original.severity;
      let icon = <ShieldCheck className="mr-1.5 size-3.5" />;
      let styles =
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700";

      if (severity === "Critical") {
        icon = <ShieldAlert className="mr-1.5 size-3.5" />;
        styles =
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50";
      } else if (severity === "High") {
        icon = <TriangleAlert className="mr-1.5 size-3.5" />;
        styles =
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50";
      } else if (severity === "Medium") {
        icon = <Shield className="mr-1.5 size-3.5" />;
        styles =
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50";
      }

      return (
        <div className="flex w-24 items-center">
          <Badge
            variant="outline"
            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${styles}`}
          >
            {icon}
            {row.original.severity}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      let icon = null;
      let styles = "";

      if (status === "open") {
        icon = <CircleDot className="mr-1.5 size-3.5" />;
        styles =
          "text-orange-600 dark:text-orange-400 border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20";
      } else if (status === "in progress") {
        icon = <Loader className="mr-1.5 size-3.5 animate-spin" />;
        styles =
          "text-blue-600 dark:text-blue-400 border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20";
      } else if (status === "patched") {
        icon = <CircleCheck className="mr-1.5 size-3.5" />;
        styles =
          "text-emerald-600 dark:text-emerald-400 border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20";
      }

      return (
        <Badge
          variant="outline"
          className={`rounded-md px-2 py-0.5 text-xs font-medium capitalize ${styles}`}
        >
          {icon}
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cvss",
    header: () => <div className="text-right">CVSS</div>,
    cell: ({ row }) => {
      const score = row.original.cvss;
      const scoreColor =
        score >= 9
          ? "text-red-600 dark:text-red-400 font-bold"
          : score >= 7
            ? "text-amber-600 dark:text-amber-400 font-medium"
            : "text-muted-foreground";

      return (
        <div className={`text-right font-mono tabular-nums ${scoreColor}`}>
          {score.toFixed(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "affectedSystems",
    header: "Affected Systems",
    cell: ({ row }) => (
      <div className="grid gap-1.5">
        {row.original.affectedSystems.map((system) => (
          <Badge
            key={system}
            variant="secondary"
            className="rounded-md border bg-secondary/50 px-1.5 py-0 text-xs font-normal text-muted-foreground hover:bg-secondary"
          >
            {system}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>Edit Details</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
            Delete Record
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={isDragging ? "dragging" : undefined}
      ref={setNodeRef}
      className={`
        group relative transition-all duration-200 ease-in-out
        hover:bg-muted/40 data-[dragging=true]:z-50
        data-[dragging=true]:bg-background/95
        data-[dragging=true]:shadow-xl
        data-[dragging=true]:ring-1
        data-[dragging=true]:ring-border/50
        data-[dragging=true]:scale-[1.02]
      `}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="py-2.5">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Vulnerability Report
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and prioritize system vulnerabilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed text-xs shadow-sm"
              >
                <LayoutGrid className="mr-2 size-3.5" />
                View
                <ChevronDown className="ml-2 size-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <div className="p-2 text-xs font-medium text-muted-foreground">
                Toggle Columns
              </div>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b transition-colors"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t p-4">
          <div className="flex-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            results found
          </div>
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                Rows per page
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px] text-xs">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={`${pageSize}`}
                      className="text-xs"
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex w-[100px] items-center justify-center text-xs font-medium text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
