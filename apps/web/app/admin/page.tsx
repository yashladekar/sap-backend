"use client";

import { useState, useEffect } from "react";
import { useSession, getExtendedUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {

  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,

} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Loader2,
  Users,
  UserCheck,
  UserX,
  Shield,
  ArrowLeft,
} from "lucide-react";

interface AdminStats {
  stats: {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    usersByRole: Record<string, number>;
  };
  recentSignups: Array<{
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
  }>;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/admin/stats`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = getExtendedUser(session.user);
  const isAdmin = user.role === "admin" || user.role === "super_admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and view system statistics
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.stats.totalUsers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.stats.activeUsers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Banned Users
                  </CardTitle>
                  <UserX className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.stats.bannedUsers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Admins
                  </CardTitle>
                  <Shield className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(stats.stats.usersByRole["admin"] ?? 0) +
                      (stats.stats.usersByRole["super_admin"] ?? 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/users">
                    <Button className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>
                    View role permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/roles">
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      View Roles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Signups */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentSignups.map((signup) => (
                    <div
                      key={signup.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {signup.name ?? "No name"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {signup.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{signup.role}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {stats.recentSignups.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No recent signups
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
