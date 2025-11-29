import type { Metadata } from "next";
import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/sonner";

export const metadata: Metadata = {
  title: "Auth System - Better Auth with RBAC",
  description: "Production-grade authentication and authorization system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
