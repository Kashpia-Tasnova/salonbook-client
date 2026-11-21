
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface Transaction {
  _id: string;
  customer: {
    name: string;
    email: string;
    image: string;
    phone: string;
  };
  serviceName: string;
  appointmentDate: string | null;
  appointmentTime: string | null;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSessionReference: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionDate: string | null;
}

interface TransactionsResponse {
  success: boolean;
  total: number;
  transactions: Transaction[];
  message?: string;
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

  const date = dateOnly
    ? (() => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
      })()
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-50 text-green-700";

    case "pending":
      return "bg-yellow-50 text-yellow-700";

    case "failed":
    case "unpaid":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 border border-[#E6E1DD] bg-white"
          />
        ))}
      </div>

      <div className="border border-[#E6E1DD] bg-white p-6">
        <div className="mb-6 h-5 w-40 bg-[#F5ECE8]" />

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="mb-5 h-12 bg-[#FDFCFC]"
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/admin/transactions", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data: TransactionsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load transactions."
        );
      }

      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Transactions fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        transaction.customer?.name?.toLowerCase().includes(searchValue) ||
        transaction.customer?.email?.toLowerCase().includes(searchValue) ||
        transaction.serviceName?.toLowerCase().includes(searchValue) ||
        transaction.stripeSessionId?.toLowerCase().includes(searchValue) ||
        transaction.stripeSessionReference?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        transaction.paymentStatus?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const totalRevenue = transactions
    .filter((transaction) => transaction.paymentStatus.toLowerCase() === "paid")
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);

  const paidTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus.toLowerCase() === "paid"
  ).length;

  return (
    <main>
      {/* Page Heading */}
      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">
            Administration
          </p>

          <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-[#7A7470]">
            View and monitor your salon payment transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTransactions}
          disabled={isLoading}
          className="w-fit border border-[#D5B6A9] px-5 py-3 text-sm text-[#967467] transition hover:bg-[#F5ECE8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </section>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="border border-red-200 bg-white p-6">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchTransactions}
            className="mt-4 bg-[#46322D] px-5 py-2.5 text-sm text-white transition hover:bg-[#967467]"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="border border-[#E6E1DD] bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center bg-[#F5ECE8] font-serif text-2xl text-[#967467]">
                $
              </div>

              <p className="text-sm text-[#7A7470]">
                Total Paid Revenue
              </p>

              <p className="mt-2 font-serif text-3xl text-[#46322D]">
                {formatAmount(totalRevenue, "USD")}
              </p>
            </div>

            <div className="border border-[#E6E1DD] bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center bg-[#F5ECE8] font-serif text-2xl text-[#967467]">
                ▤
              </div>

              <p className="text-sm text-[#7A7470]">
                Total Transactions
              </p>

              <p className="mt-2 font-serif text-3xl text-[#46322D]">
                {transactions.length}
              </p>
            </div>

            <div className="border border-[#E6E1DD] bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center bg-[#F5ECE8] font-serif text-2xl text-[#967467]">
                ✓
              </div>

              <p className="text-sm text-[#7A7470]">
                Successful Payments
              </p>

              <p className="mt-2 font-serif text-3xl text-[#46322D]">
                {paidTransactions}
              </p>
            </div>
          </section>

          {/* Transaction Table */}
          <section className="border border-[#E6E1DD] bg-white">
            <div className="border-b border-[#E6E1DD] px-5 py-5 sm:px-6">
              <h2 className="font-serif text-xl text-[#46322D]">
                Payment History
              </h2>

              <p className="mt-1 text-sm text-[#7A7470]">
                All recorded Stripe transactions.
              </p>

              {/* Search and Filter */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer, service or Stripe reference..."
                  className="min-w-0 flex-1 border border-[#E6E1DD] bg-[#FDFCFC] px-4 py-3 text-sm text-[#46322D] outline-none transition placeholder:text-[#A39A94] focus:border-[#B39A7D]"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="border border-[#E6E1DD] bg-white px-4 py-3 text-sm text-[#46322D] outline-none focus:border-[#B39A7D]"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-[#F5ECE8] font-serif text-2xl text-[#967467]">
                  $
                </div>

                <h3 className="font-serif text-lg text-[#46322D]">
                  {transactions.length === 0
                    ? "No transactions yet"
                    : "No matching transactions"}
                </h3>

                <p className="mt-2 text-sm text-[#7A7470]">
                  {transactions.length === 0
                    ? "Successful Stripe payments will appear here."
                    : "Try changing your search or payment status filter."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px] text-left">
                  <thead>
                    <tr className="border-b border-[#E6E1DD] bg-[#FDFCFC] text-xs uppercase tracking-wider text-[#7A7470]">
                      <th className="px-5 py-4 font-medium">Customer</th>
                      <th className="px-5 py-4 font-medium">Service</th>
                      <th className="px-5 py-4 font-medium">Appointment Date</th>
                      <th className="px-5 py-4 font-medium">Payment Amount</th>
                      <th className="px-5 py-4 font-medium">Stripe Reference</th>
                      <th className="px-5 py-4 font-medium">Payment Status</th>
                      <th className="px-5 py-4 font-medium">Transaction Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="border-b border-[#E6E1DD] last:border-0 transition hover:bg-[#FDFCFC]"
                      >
                        {/* Customer Information */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            {transaction.customer?.image ? (
                              <img
                                src={transaction.customer.image}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5ECE8] font-serif text-[#967467]">
                                {transaction.customer?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "C"}
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-medium text-[#46322D]">
                                {transaction.customer?.name || "Unknown Customer"}
                              </p>

                              <p className="mt-1 text-xs text-[#7A7470]">
                                {transaction.customer?.email || "No email available"}
                              </p>

                              {transaction.customer?.phone && (
                                <p className="mt-1 text-xs text-[#A39A94]">
                                  {transaction.customer.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-5 py-5 text-sm text-[#46322D]">
                          {transaction.serviceName || "Unknown Service"}
                        </td>

                        {/* Appointment Date */}
                        <td className="px-5 py-5">
                          <p className="text-sm text-[#46322D]">
                            {formatDate(transaction.appointmentDate)}
                          </p>

                          {transaction.appointmentTime && (
                            <p className="mt-1 text-xs text-[#A39A94]">
                              {transaction.appointmentTime}
                            </p>
                          )}
                        </td>

                        {/* Payment Amount */}
                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-[#46322D]">
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </p>

                          <p className="mt-1 text-xs uppercase text-[#A39A94]">
                            {transaction.currency}
                          </p>
                        </td>

                        {/* Stripe Reference */}
                        <td className="px-5 py-5">
                          <p
                            className="font-mono text-xs text-[#967467]"
                            title={transaction.stripeSessionId}
                          >
                            {transaction.stripeSessionReference ||
                              (transaction.stripeSessionId
                                ? `...${transaction.stripeSessionId.slice(-12)}`
                                : "Unavailable")}
                          </p>

                          <p className="mt-1 text-xs text-[#A39A94]">
                            Stripe Checkout
                          </p>
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-block px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                              transaction.paymentStatus
                            )}`}
                          >
                            {transaction.paymentStatus || "Unknown"}
                          </span>
                        </td>

                        {/* Transaction Date */}
                        <td className="px-5 py-5 text-sm text-[#7A7470]">
                          {formatDateTime(transaction.transactionDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredTransactions.length > 0 && (
              <div className="border-t border-[#E6E1DD] px-5 py-4 text-xs text-[#7A7470] sm:px-6">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </div>
            )}
          </section>

          {/* Read-only Notice */}
          <div className="mt-5 border border-[#E6E1DD] bg-[#F5ECE8]/50 px-5 py-4">
            <p className="text-sm font-medium text-[#46322D]">
              Payment records are read-only.
            </p>

            <p className="mt-1 text-xs leading-6 text-[#7A7470]">
              Payment statuses are updated automatically after Stripe verifies
              successful payments through the webhook. Administrators cannot
              manually modify transaction records.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
