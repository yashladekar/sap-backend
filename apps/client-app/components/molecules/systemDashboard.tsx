"use client";
import { useState } from "react";
import SearchFilter from "../atoms/search-filter";
import { SystemCard, SystemStatus } from "../cards/SystemCard";
import { Database } from "lucide-react";

type FilterType = "" | "critical" | "protected" | "warning";

const systemsData = [
  {
    icon: Database,
    title: "SAP ECC 6.0",
    status: "Critical" as SystemStatus,
    version: "ECC 6.0 EHP8",
    vulnerabilities: 5,
    lastPatch: "2024-01-15",
  },
  {
    icon: Database,
    title: "SAP S/4HANA",
    status: "Warning" as SystemStatus,
    version: "2022 FPS02",
    vulnerabilities: 2,
    lastPatch: "2024-02-10",
  },
  {
    icon: Database,
    title: "SAP BW/4HANA",
    status: "Protected" as SystemStatus,
    version: "2023 FPS01",
    vulnerabilities: 0,
    lastPatch: "2024-02-28",
  },
  {
    icon: Database,
    title: "SAP Factors",
    status: "Protected" as SystemStatus,
    version: "Cloud Q1 2024",
    vulnerabilities: 0,
    lastPatch: "Auto-updated",
  },
];

const SystemDashboardSection = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("");

  const filtered = systemsData.filter((sys) => {
    const statusMatches =
      filter === "" || sys.status.toLowerCase() === filter.toLowerCase();
    const q = search.trim().toLowerCase();
    const searchMatches =
      q === "" ||
      sys.title.toLowerCase().includes(q) ||
      sys.version.toLowerCase().includes(q);
    return statusMatches && searchMatches;
  });

  return (
    <>
      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {filtered.map((system) => (
          <SystemCard
            key={system.title}
            icon={system.icon}
            title={system.title}
            status={system.status}
            version={system.version}
            vulnerabilities={system.vulnerabilities}
            lastPatch={system.lastPatch}
          />
        ))}
      </div>
    </>
  );
};

export default SystemDashboardSection;
