"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Users,
  Search,
  Loader2,
  ShieldCheck,
  ShieldBan,
  UserRound,
  Eye,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [updatingUser, setUpdatingUser] = useState(null);


 // Fetch all users
const fetchUsers = async () => {
  try {
    setLoading(true);

    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch users");
    }

    setUsers(
      Array.isArray(result)
        ? result
        : result.users || []
    );

  } catch (error) {
    console.error("Fetch Users Error:", error);
    toast.error(error.message || "Failed to load users");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  let isMounted = true;

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users");
      }

      if (isMounted) {
        setUsers(
          Array.isArray(result)
            ? result
            : result.users || []
        );
      }

    } catch (error) {
      console.error("Fetch Users Error:", error);

      if (isMounted) {
        toast.error(error.message || "Failed to load users");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadUsers();

  return () => {
    isMounted = false;
  };
}, []);



  // Search and role filtering
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // User status helper
  const isUserBlocked = (user) => {
    return user.isBlocked === true || user.blocked === true;
  };

  // Block / Unblock User
  const handleBlockToggle = async (user) => {
    try {
      setUpdatingUser(user._id || user.id);

      const { data } = await authClient.token();

      const blocked = isUserBlocked(user);

      const response = await fetch(
        `${API_URL}/admin/users/${user._id || user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            isBlocked: !blocked,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user status");
      }

      toast.success(
        blocked
          ? "User unblocked successfully"
          : "User blocked successfully"
      );

      // Update frontend state
      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          (item._id || item.id) === (user._id || user.id)
            ? {
                ...item,
                isBlocked: !blocked,
                blocked: !blocked,
              }
            : item
        )
      );

      // Update selected user if dialog is open
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          isBlocked: !blocked,
          blocked: !blocked,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdatingUser(null);
    }
  };

  // User Details Dialog
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <Badge className="bg-[#76243A]/10 text-[#76243A] hover:bg-[#76243A]/10">
          Admin
        </Badge>
      );
    }

    if (role === "vendor") {
      return (
        <Badge className="bg-[#647C67]/10 text-[#647C67] hover:bg-[#647C67]/10">
          Vendor
        </Badge>
      );
    }

    return (
      <Badge className="bg-[#94765F]/10 text-[#94765F] hover:bg-[#94765F]/10">
        Customer
      </Badge>
    );
  };

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div>
        <p className="text-sm font-medium text-[#94765F]">
          Administration
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#76243A] md:text-3xl">
          Manage Users
        </h2>

        <p className="mt-2 text-sm text-[#625B56]">
          View, search, and manage all registered platform users.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">
                Total Users
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#76243A]">
                {users.length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#76243A]/10 text-[#76243A]">
              <Users size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">
                Vendors
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#76243A]">
                {users.filter((user) => user.role === "vendor").length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#647C67]/10 text-[#647C67]">
              <UserRound size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">
                Customers
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#76243A]">
                {users.filter((user) => user.role === "customer").length}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#94765F]/10 text-[#94765F]">
              <Users size={22} />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Search and Filters */}

      <Card className="border-[#E8DDD0] bg-white shadow-sm">
        <CardContent className="p-5">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94765F]"
              />

              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 border-[#E8DDD0] pl-10 focus-visible:ring-[#76243A]"
              />
            </div>

            {/* Role Filter */}

            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="h-11 w-full border-[#E8DDD0] md:w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Roles
                </SelectItem>

                <SelectItem value="admin">
                  Admin
                </SelectItem>

                <SelectItem value="vendor">
                  Vendor
                </SelectItem>

                <SelectItem value="customer">
                  Customer
                </SelectItem>
              </SelectContent>
            </Select>

          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[#94765F]">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

        </CardContent>
      </Card>

      {/* Users Table */}

      <Card className="overflow-hidden border-[#E8DDD0] bg-white shadow-sm">

        <CardContent className="p-0">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2
                size={35}
                className="animate-spin text-[#76243A]"
              />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
              <Users
                size={45}
                className="mb-4 text-[#94765F]"
              />

              <h3 className="text-lg font-semibold text-[#76243A]">
                No Users Found
              </h3>

              <p className="mt-2 text-sm text-[#94765F]">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <Table>

                <TableHeader>
                  <TableRow className="border-[#E8DDD0] bg-[#F8F5F0] hover:bg-[#F8F5F0]">

                    <TableHead className="min-w-[220px] text-[#76243A]">
                      User
                    </TableHead>

                    <TableHead className="text-[#76243A]">
                      Role
                    </TableHead>

                    <TableHead className="text-[#76243A]">
                      Status
                    </TableHead>

                    <TableHead className="text-right text-[#76243A]">
                      Actions
                    </TableHead>

                  </TableRow>
                </TableHeader>

                <TableBody>

                  {filteredUsers.map((user) => {
                    const blocked = isUserBlocked(user);

                    const userId = user._id || user.id;

                    return (
                      <TableRow
                        key={userId}
                        className="border-[#E8DDD0]"
                      >

                        {/* User */}

                        <TableCell>
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8DDD0] text-[#76243A]">

                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name || "User"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserRound size={20} />
                              )}

                            </div>

                            <div className="min-w-0">
                              <p className="font-medium text-[#76243A]">
                                {user.name || "Unnamed User"}
                              </p>

                              <p className="max-w-[220px] truncate text-sm text-[#94765F]">
                                {user.email}
                              </p>
                            </div>

                          </div>
                        </TableCell>

                        {/* Role */}

                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>

                        {/* Status */}

                        <TableCell>
                          {blocked ? (
                            <Badge variant="destructive">
                              Blocked
                            </Badge>
                          ) : (
                            <Badge className="bg-[#647C67]/10 text-[#647C67] hover:bg-[#647C67]/10">
                              Active
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}

                        <TableCell>
                          <div className="flex justify-end gap-2">

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDetails(user)}
                              className="h-9 w-9 border-[#E8DDD0] text-[#76243A] hover:bg-[#F8F5F0]"
                            >
                              <Eye size={16} />
                            </Button>

                            {user.role !== "admin" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={updatingUser === userId}
                                onClick={() => handleBlockToggle(user)}
                                className={`h-9 ${
                                  blocked
                                    ? "border-[#647C67] text-[#647C67] hover:bg-[#647C67]/10"
                                    : "border-red-200 text-red-600 hover:bg-red-50"
                                }`}
                              >
                                {updatingUser === userId ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : blocked ? (
                                  <>
                                    <ShieldCheck size={15} />
                                    Unblock
                                  </>
                                ) : (
                                  <>
                                    <ShieldBan size={15} />
                                    Block
                                  </>
                                )}
                              </Button>
                            )}

                          </div>
                        </TableCell>

                      </TableRow>
                    );
                  })}

                </TableBody>

              </Table>

            </div>
          )}

        </CardContent>
      </Card>

      {/* User Details Dialog */}

      <Dialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >
        <DialogContent className="max-w-md border-[#E8DDD0] bg-[#F8F5F0]">

          <DialogHeader>
            <DialogTitle className="text-xl text-[#76243A]">
              User Details
            </DialogTitle>

            <DialogDescription className="text-[#94765F]">
              Registered user information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5">

              {/* Profile */}

              <div className="flex flex-col items-center rounded-2xl bg-white p-5">

                <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#E8DDD0] text-[#76243A]">

                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={35} />
                  )}

                </div>

                <h3 className="text-lg font-semibold text-[#76243A]">
                  {selectedUser.name || "Unnamed User"}
                </h3>

                <p className="text-sm text-[#94765F]">
                  {selectedUser.email}
                </p>

                <div className="mt-3">
                  {getRoleBadge(selectedUser.role)}
                </div>

              </div>

              {/* Details */}

              <div className="space-y-3 rounded-2xl bg-white p-5">

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-[#94765F]">
                    User ID
                  </span>

                  <span className="break-all text-right text-sm font-medium text-[#76243A]">
                    {selectedUser._id || selectedUser.id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-[#94765F]">
                    Role
                  </span>

                  <span className="text-sm font-medium capitalize text-[#76243A]">
                    {selectedUser.role}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-[#94765F]">
                    Status
                  </span>

                  <span
                    className={`text-sm font-medium ${
                      isUserBlocked(selectedUser)
                        ? "text-red-600"
                        : "text-[#647C67]"
                    }`}
                  >
                    {isUserBlocked(selectedUser)
                      ? "Blocked"
                      : "Active"}
                  </span>
                </div>

                {selectedUser.phone && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#94765F]">
                      Phone
                    </span>

                    <span className="text-sm font-medium text-[#76243A]">
                      {selectedUser.phone}
                    </span>
                  </div>
                )}

              </div>

              {/* Block / Unblock */}

              {selectedUser.role !== "admin" && (
                <Button
                  disabled={
                    updatingUser ===
                    (selectedUser._id || selectedUser.id)
                  }
                  onClick={() => handleBlockToggle(selectedUser)}
                  className={`w-full ${
                    isUserBlocked(selectedUser)
                      ? "bg-[#647C67] hover:bg-[#526655]"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {updatingUser ? (
                    <Loader2 className="animate-spin" />
                  ) : isUserBlocked(selectedUser) ? (
                    <>
                      <ShieldCheck size={17} />
                      Unblock User
                    </>
                  ) : (
                    <>
                      <ShieldBan size={17} />
                      Block User
                    </>
                  )}
                </Button>
              )}

            </div>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}