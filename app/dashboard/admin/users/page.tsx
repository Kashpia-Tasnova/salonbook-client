
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Loader2,
  X,
  AlertTriangle,
  Mail,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-hot-toast";

type UserRole = "admin" | "customer";

type SalonUser = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  isBlocked: boolean;
  createdAt?: string | null;
};

type UserFilter = "all" | "active" | "blocked";

const formatDate = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SalonUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UserFilter>("all");
  const [selectedUser, setSelectedUser] = useState<SalonUser | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    try {
      setError("");

      const response = await fetch("/api/protected/admin/users", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch users.");
      }

      const normalizedUsers: SalonUser[] = (data.users || []).map(
        (user: Partial<SalonUser>) => ({
          _id: String(user._id || ""),
          name: user.name || "Unknown User",
          email: user.email || "",
          image: user.image || "",
          role: user.role === "admin" ? "admin" : "customer",
          phone: user.phone || "",
          isBlocked: user.isBlocked === true,
          createdAt: user.createdAt || null,
        })
      );

      setUsers(normalizedUsers);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchUsers(controller.signal);

    return () => controller.abort();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !user.isBlocked) ||
        (filter === "blocked" && user.isBlocked);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const activeCustomers = users.filter(
    (user) => user.role === "customer" && !user.isBlocked
  ).length;

  const blockedCustomers = users.filter(
    (user) => user.role === "customer" && user.isBlocked
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
  };

  const handleStatusChange = async () => {
    if (!selectedUser || updating) return;

    const user = selectedUser;
    const nextBlockedStatus = !user.isBlocked;

    setUpdating(true);

    const toastId = toast.loading(
      nextBlockedStatus ? "Blocking customer..." : "Unblocking customer..."
    );

    try {
      const response = await fetch(
        `/api/protected/admin/users/${encodeURIComponent(user._id)}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isBlocked: nextBlockedStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update user status.");
      }

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: nextBlockedStatus }
            : item
        )
      );

      toast.success(
        nextBlockedStatus
          ? "Customer blocked successfully."
          : "Customer unblocked successfully.",
        { id: toastId }
      );

      setSelectedUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      toast.error(message, { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  const statCards = [
    {
      label: "Total Customers",
      value: totalCustomers,
      icon: Users,
      description: "Registered customer accounts",
    },
    {
      label: "Active Customers",
      value: activeCustomers,
      icon: UserCheck,
      description: "Accounts currently active",
    },
    {
      label: "Blocked Customers",
      value: blockedCustomers,
      icon: UserX,
      description: "Accounts restricted",
    },
    {
      label: "Administrators",
      value: adminCount,
      icon: ShieldCheck,
      description: "Administrative accounts",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B39A7D]">
            Administration
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#46322D]">
            Manage Users
          </h1>

          <p className="mt-2 text-sm text-[#7A7470]">
            View customer accounts and manage their access to SalonBook.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 border border-[#E6E1DD] bg-white px-5 py-3 text-sm text-[#46322D] transition hover:bg-[#F5ECE8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="border border-[#E6E1DD] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#7A7470]">{stat.label}</p>

                <div className="flex h-10 w-10 items-center justify-center bg-[#F5ECE8] text-[#967467]">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-4 font-serif text-3xl text-[#46322D]">
                {loading ? "—" : stat.value}
              </p>

              <p className="mt-1 text-xs text-[#A39A94]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* User Management */}
      <div className="border border-[#E6E1DD] bg-white">
        <div className="border-b border-[#E6E1DD] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-serif text-xl text-[#46322D]">
                Registered Accounts
              </h2>

              <p className="mt-1 text-sm text-[#A39A94]">
                {loading
                  ? "Loading accounts..."
                  : `${filteredUsers.length} of ${users.length} accounts`}
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A39A94]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full border border-[#E6E1DD] bg-[#FDFCFC] py-3 pl-10 pr-4 text-sm text-[#46322D] outline-none transition placeholder:text-[#B7AEA8] focus:border-[#B39A7D]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                ["all", "All Accounts"],
                ["active", "Active"],
                ["blocked", "Blocked"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`px-4 py-2 text-xs font-medium transition ${
                  filter === value
                    ? "bg-[#46322D] text-white"
                    : "border border-[#E6E1DD] bg-white text-[#7A7470] hover:bg-[#F5ECE8]"
                }`}
              >
                {label}
                {value === "all" && ` (${users.length})`}
                {value === "active" && ` (${activeCustomers})`}
                {value === "blocked" && ` (${blockedCustomers})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4"
              >
                <div className="h-11 w-11 rounded-full bg-[#F5ECE8]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-36 bg-[#F5ECE8]" />
                  <div className="h-3 w-52 bg-[#F5ECE8]" />
                </div>
                <div className="h-8 w-20 bg-[#F5ECE8]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <AlertTriangle
              size={32}
              className="mx-auto text-[#B39A7D]"
            />

            <p className="mt-4 text-sm text-[#46322D]">{error}</p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-5 border border-[#B39A7D] px-5 py-2.5 text-sm text-[#967467] hover:bg-[#F5ECE8]"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users
              size={34}
              className="mx-auto text-[#B39A7D]"
            />

            <h3 className="mt-4 font-serif text-lg text-[#46322D]">
              No users found
            </h3>

            <p className="mt-2 text-sm text-[#A39A94]">
              Try changing your search or account filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#FDFCFC]">
                  <tr className="border-b border-[#E6E1DD] text-xs uppercase tracking-wider text-[#A39A94]">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#F0ECE9] last:border-0 hover:bg-[#FDFCFC]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={44}
                              height={44}
                              unoptimized
                              className="h-11 w-11 rounded-full border border-[#E6E1DD] object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5ECE8] font-serif text-lg text-[#967467]">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#46322D]">
                              {user.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#A39A94]">
                              <Mail size={12} />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs ${
                            user.role === "admin"
                              ? "bg-[#F5ECE8] text-[#967467]"
                              : "bg-[#FDFCFC] text-[#7A7470]"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck size={13} />
                          ) : (
                            <Users size={13} />
                          )}
                          {user.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#7A7470]">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays
                            size={14}
                            className="text-[#B39A7D]"
                          />
                          {formatDate(user.createdAt)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs ${
                            user.isBlocked
                              ? "text-[#B45353]"
                              : "text-[#66866D]"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.isBlocked
                                ? "bg-[#B45353]"
                                : "bg-[#66866D]"
                            }`}
                          />
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        {user.role === "customer" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className={`px-4 py-2 text-xs font-medium transition ${
                              user.isBlocked
                                ? "border border-[#66866D] text-[#66866D] hover:bg-[#EDF4EE]"
                                : "border border-[#D8B4A8] text-[#A45E55] hover:bg-[#FBF0EE]"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        ) : (
                          <span className="text-xs text-[#B7AEA8]">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-[#F0ECE9] md:hidden">
              {filteredUsers.map((user) => (
                <div key={user._id} className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded-full border border-[#E6E1DD] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5ECE8] font-serif text-lg text-[#967467]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#46322D]">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-[#A39A94]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-[#F5ECE8] px-3 py-1.5 text-[#967467]">
                      {user.role === "admin" ? "Admin" : "Customer"}
                    </span>

                    <span
                      className={
                        user.isBlocked
                          ? "bg-[#FBF0EE] px-3 py-1.5 text-[#A45E55]"
                          : "bg-[#EDF4EE] px-3 py-1.5 text-[#66866D]"
                      }
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>

                    <span className="text-[#A39A94]">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>

                  {user.role === "customer" && (
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className={`w-full border px-4 py-2.5 text-xs font-medium ${
                        user.isBlocked
                          ? "border-[#66866D] text-[#66866D]"
                          : "border-[#D8B4A8] text-[#A45E55]"
                      }`}
                    >
                      {user.isBlocked ? "Unblock Customer" : "Block Customer"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !updating) {
              setSelectedUser(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-action-title"
            className="w-full max-w-md border border-[#E6E1DD] bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center bg-[#F5ECE8] text-[#967467]">
                {selectedUser.isBlocked ? (
                  <UserCheck size={22} />
                ) : (
                  <ShieldAlert size={22} />
                )}
              </div>

              <button
                type="button"
                disabled={updating}
                onClick={() => setSelectedUser(null)}
                aria-label="Close confirmation"
                className="text-[#A39A94] transition hover:text-[#46322D] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="user-action-title"
              className="mt-5 font-serif text-2xl text-[#46322D]"
            >
              {selectedUser.isBlocked
                ? "Unblock Customer?"
                : "Block Customer?"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#7A7470]">
              {selectedUser.isBlocked
                ? "This customer will regain access to protected SalonBook features."
                : "This customer will lose access to protected SalonBook features until their account is unblocked."}
            </p>

            <div className="mt-5 border border-[#E6E1DD] bg-[#FDFCFC] p-4">
              <p className="text-sm font-medium text-[#46322D]">
                {selectedUser.name}
              </p>
              <p className="mt-1 text-xs text-[#A39A94]">
                {selectedUser.email}
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={updating}
                onClick={() => setSelectedUser(null)}
                className="border border-[#E6E1DD] px-5 py-3 text-sm text-[#7A7470] transition hover:bg-[#FDFCFC] disabled:opacity-50"
              >
                No, Go Back
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={handleStatusChange}
                className={`flex items-center justify-center gap-2 px-5 py-3 text-sm text-white transition disabled:opacity-50 ${
                  selectedUser.isBlocked
                    ? "bg-[#66866D] hover:bg-[#54745B]"
                    : "bg-[#A45E55] hover:bg-[#8F4D45]"
                }`}
              >
                {updating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Please wait...
                  </>
                ) : selectedUser.isBlocked ? (
                  "Yes, Unblock"
                ) : (
                  "Yes, Block"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
