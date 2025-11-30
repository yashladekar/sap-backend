import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "../molecules/data-table/data-table-column-header";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";

// Schema for recent leads
export const recentLeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  status: z.string(),
  source: z.string(),
  lastActivity: z.string(),
});

export const recentLeadsColumns: ColumnDef<z.infer<typeof recentLeadSchema>>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ref" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.id}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <span>{row.original.name}</span>,
      enableHiding: false,
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => <span>{row.original.company}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.status}</Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "source",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Source" />
      ),
      cell: ({ row }) => <Badge variant="outline">{row.original.source}</Badge>,
      enableSorting: false,
    },
    {
      accessorKey: "lastActivity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Activity" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.lastActivity}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      cell: () => (
        <Button
          variant="ghost"
          className="text-muted-foreground flex size-8"
          size="icon"
        >
          <EllipsisVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      ),
      enableSorting: false,
    },
  ];
