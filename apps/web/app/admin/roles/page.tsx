"use client";

import { useSession, getExtendedUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Loader2, ArrowLeft, Check, X } from "lucide-react";
import { Role } from "@workspace/auth/roles";
import { Permission, ROLE_PERMISSIONS, getRolePermissions } from "@workspace/auth/permissions";

export default function AdminRolesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

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

  const roles = Object.values(Role);
  const allPermissions = Object.values(Permission);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            View roles and their permissions
          </p>
        </div>

        {/* Roles Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          {roles.map((role) => {
            const permissions = getRolePermissions(role);
            return (
              <Card key={role}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {permissions.length} permissions
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {ROLE_PERMISSIONS[role]?.includes("*")
                      ? "All permissions"
                      : ROLE_PERMISSIONS[role]?.slice(0, 3).join(", ") +
                      (ROLE_PERMISSIONS[role]?.length > 3 ? "..." : "")}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions Matrix</CardTitle>
            <CardDescription>
              View which roles have which permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Permission</TableHead>
                    {roles.map((role) => (
                      <TableHead key={role} className="text-center">
                        <Badge variant="outline">{role}</Badge>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPermissions.map((permission) => (
                    <TableRow key={permission}>
                      <TableCell className="font-mono text-sm">
                        {permission}
                      </TableCell>
                      {roles.map((role) => {
                        const hasPermission = getRolePermissions(role).includes(permission);
                        return (
                          <TableCell key={`${role}-${permission}`} className="text-center">
                            {hasPermission ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Role Descriptions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Role Descriptions</CardTitle>
            <CardDescription>
              Understanding each role&apos;s purpose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge>SUPER_ADMIN</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Full system access with all permissions. Can manage all users,
                  roles, and system settings. Only super admins can assign or
                  remove the super admin role.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge>ADMIN</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Administrative access to manage users and resources. Can ban
                  users, view all users, and manage most system functions except
                  role assignments.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge>MANAGER</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Can manage resources and view user information. Limited
                  administrative capabilities focused on resource management.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge>USER</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Standard user access. Can view their own profile, read
                  resources, and create new resources.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge>GUEST</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Limited read-only access. Can only view public resources.
                  This is the most restricted role.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
