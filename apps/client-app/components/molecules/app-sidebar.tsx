"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/atoms/nav-main"
import { NavProjects } from "@/components/atoms/nav-projects"
import { NavSecondary } from "@/components/atoms/nav-secondary"
import { NavUser } from "@/components/atoms/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Analysis",
      url: "/analysis",
      icon: SquareTerminal,
      items: [
        {
          title: "Security Advisor",
          url: "/analysis/security",
        },
        {
          title: "Status and Trends",
          url: "/analysis/status",
        },
      ],
    },
    {
      title: "Assess",
      url: "/assess",
      icon: Bot,
      items: [
        {
          title: "Dashboard",
          url: "/assess/dashboard",
        },
        {
          title: "Issues",
          url: "/assess/issues",
        },
        {
          title: "Occurences",
          url: "/assess/occurances",
        },
        {
          title: "Alerts",
          url: "/assess/alerts",
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Assets",
          url: "#",
        },
        {
          title: "Discoveries",
          url: "#",
        },
        {
          title: "Linked Discoveries",
          url: "#",
        },
        {
          title: "Diagnostics",
          url: "#",
        },
        {
          title: "Alerts",
          url: "#",
        },
      ],
    },
    {
      title: "Policies",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Policy Details",
          url: "#",
        },
        {
          title: "Jobs",
          url: "#",
        },
        {
          title: "Custom Modules",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! w-fit"
      {...props}
    >
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
