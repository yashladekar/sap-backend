"use client";

import { Command, SidebarIcon } from "lucide-react";

import { SearchForm } from "@/components/atoms/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { ModeToggle } from "@/components/atoms/darkmode";
import { FeedbackForm } from "../atoms/feedback";
import Notification from "../atoms/notification";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className="flex items-center gap-3 py-2 rounded-md">
          <div className="shrink-0">
            <div
              className="flex items-center justify-center rounded-lg w-10 h-10
                 bg-indigo-50 text-indigo-700 dark:bg-indigo-600 dark:text-indigo-50
                 shadow-sm"
              aria-hidden="true"
            >
              <Command className="w-6 h-6" />
            </div>
          </div>

          <div className="min-w-0 flex items-baseline justify-center gap-2">
            <span
              className="block truncate font-semibold text-xl tracking-wider uppercase
                     text-slate-900 dark:text-slate-100"
            >
              SAP NOTES
            </span>
            <span
              className="block truncate text-sm font-semibold
                     text-slate-500 dark:text-slate-400"
            >
              Enterprise
            </span>
          </div>
        </div>
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
        <div className="w-full sm:ml-auto sm:w-auto items-center gap-2 flex">
          <Notification />
          <ModeToggle />
          <FeedbackForm />
        </div>
      </div>
    </header>
  );
}
