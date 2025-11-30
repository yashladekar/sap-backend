import { AppSidebar } from "@/components/molecules/app-sidebar";
import { CriticalCard } from "@/components/cards/criticalCard";
import { HighRiskCard } from "@/components/cards/highRiskCard";
import { PatchComplianceCard } from "@/components/cards/patchComplianceCard";
import { ProtectedSystemsCard } from "@/components/cards/protectSystemCard";
import SystemDashboardSection from "@/components/molecules/systemDashboard";
import { SiteHeader } from "@/components/molecules/site-header";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import VulnerabilitySection from "@/components/molecules/VulnerabilitySection";

export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(15))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="space-y-2 px-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-2">
                <CriticalCard />
                <HighRiskCard />
                <PatchComplianceCard />
                <ProtectedSystemsCard />
              </div>
              <SystemDashboardSection />
              <VulnerabilitySection />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
