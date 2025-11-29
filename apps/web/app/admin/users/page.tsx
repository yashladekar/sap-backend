"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, getExtendedUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@workspace/ui/components/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@workspace/ui/components/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@workspace/ui/components/alert-dialog";
import {
  Loader2,
  ArrowLeft,
  MoreHorizontal,
  UserX,
  UserCheck,
  Shield,
  Trash2,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  image: string | null;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ban dialog state
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Role dialog state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/users?page=${page}&limit=10`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session, fetchUsers]);

  const handleBanUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/admin/users/ban`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: selectedUser.id,
            reason: banReason || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to ban user");
      }

      setBanDialogOpen(false);
      setBanReason("");
      setSelectedUser(null);
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async (user: User) => {
    setActionLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/admin/users/unban`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to unban user");
      }

      fetchUsers(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unban user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setActionLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/users/${selectedUser.id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: selectedRole }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update role");
      }

      setRoleDialogOpen(false);
      setSelectedRole("");
      setSelectedUser(null);
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/users/${userToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete user");
      }

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

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

  const currentUser = getExtendedUser(session.user);
  const isAdmin = currentUser.role === "admin" || currentUser.role === "super_admin";
  const isSuperAdmin = currentUser.role === "super_admin";

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
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            View and manage all users in the system
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              {pagination.total} total users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.name ?? "No name"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.banned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : user.emailVerified ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={user.id === currentUser.id}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.banned ? (
                                <DropdownMenuItem
                                  onClick={() => handleUnbanUser(user)}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setBanDialogOpen(true);
                                  }}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Ban User
                                </DropdownMenuItem>
                              )}
                              {isSuperAdmin && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setSelectedRole(user.role);
                                    setRoleDialogOpen(true);
                                  }}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => openDeleteDialog(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.name ?? selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banReason">Reason (optional)</Label>
              <Input
                id="banReason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for ban"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBanDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUser}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedUser?.name ?? selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {["guest", "user", "manager", "admin", "super_admin"].map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  onClick={() => setSelectedRole(role)}
                  className="justify-start"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name ?? userToDelete?.email}?
              This action cannot be undone. All user data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
