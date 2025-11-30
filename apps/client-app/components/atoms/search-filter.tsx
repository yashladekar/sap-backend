"use client";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import {
  SearchIcon,
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  Siren,
  RefreshCw,
} from "lucide-react";

type FilterType = "" | "critical" | "protected" | "warning";

function SearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
}: {
  search: string;
  setSearch: (v: string) => void;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}) {
  const resetAll = () => {
    setSearch("");
    setFilter("");
  };

  return (
    <div>
      <div className="py-2">
        <h1 className="text-xl font-semibold capitalize">Total Systems</h1>
        <div className="flex items-center justify-between">
          <ButtonGroup className="w-full max-w-sm pt-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline" aria-label="Search">
              <SearchIcon />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button
              variant={filter === "" ? "default" : "outline"}
              onClick={() => setFilter("")}
              className="text-xs p-2"
            >
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="pl-2!">
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="[--radius:1rem]">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={resetAll} className="text-xs">
                    <RefreshCw />
                    Reset Filters
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilter("critical")}
                    className="text-xs"
                  >
                    <Siren />
                    Critical
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilter("protected")}
                    className="text-xs"
                  >
                    <CheckIcon />
                    Protected
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilter("warning")}
                    className="text-xs"
                  >
                    <AlertTriangleIcon />
                    Warning
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;

