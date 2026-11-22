
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Search,
  Loader2,
  Receipt,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ManageTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch transactions

 useEffect(() => {
  let isMounted = true;

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/admin/transactions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch transactions");
      }

      if (isMounted) {
        setTransactions(
          Array.isArray(result) ? result : result.transactions || []
        );
      }
    } catch (error) {
      console.error("Fetch Transactions Error:", error);

      if (isMounted) {
        toast.error(error.message || "Failed to load transactions");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadTransactions();

  return () => {
    isMounted = false;
  };
}, []);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      transaction.vendorName?.toLowerCase().includes(searchText) ||
      transaction.vendorEmail?.toLowerCase().includes(searchText) ||
      transaction.plan?.toLowerCase().includes(searchText) ||
      transaction.stripeInvoiceId?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      transaction.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paidCount = transactions.filter(
    (item) => item.status?.toLowerCase() === "paid"
  ).length;

  const pendingCount = transactions.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const failedCount = transactions.filter(
    (item) => item.status?.toLowerCase() === "failed"
  ).length;

  // Format amount
  const formatAmount = (amount, currency) => {
    const value = Number(amount || 0);

    // Stripe stores amount in the smallest currency unit.
    // BDT and USD both use 2 decimal places.
    const formattedAmount = (value / 100).toFixed(2);

    return `${(currency || "usd").toUpperCase()} ${Number(
      formattedAmount
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Status badge
  const getStatusBadge = (status) => {
    const value = status?.toLowerCase();

    if (value === "paid") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle size={13} className="mr-1" />
          Paid
        </Badge>
      );
    }

    if (value === "failed") {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle size={13} className="mr-1" />
          Failed
        </Badge>
      );
    }

    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
        <Clock size={13} className="mr-1" />
        {status || "Pending"}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#94765F]">
          Administration
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#76243A] md:text-3xl">
          Transactions
        </h2>

        <p className="mt-2 text-sm text-[#625B56]">
          Monitor vendor subscription payments and transaction history.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">
                Total Transactions
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#76243A]">
                {transactions.length}
              </h3>
            </div>
            <Receipt size={25} className="text-[#76243A]" />
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">Paid</p>
              <h3 className="mt-2 text-2xl font-bold text-green-700">
                {paidCount}
              </h3>
            </div>
            <CheckCircle size={25} className="text-green-600" />
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">Pending</p>
              <h3 className="mt-2 text-2xl font-bold text-amber-600">
                {pendingCount}
              </h3>
            </div>
            <Clock size={25} className="text-amber-600" />
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#94765F]">Failed</p>
              <h3 className="mt-2 text-2xl font-bold text-red-600">
                {failedCount}
              </h3>
            </div>
            <XCircle size={25} className="text-red-600" />
          </CardContent>
        </Card>

      </div>

      {/* Search and Filter */}
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94765F]"
            />

            <Input
              placeholder="Search vendor, email or invoice ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden border-[#E8DDD0] bg-white">
        <CardContent className="p-0">

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2
                size={35}
                className="animate-spin text-[#76243A]"
              />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
              <CreditCard
                size={40}
                className="mb-3 text-[#94765F]"
              />

              <h3 className="font-semibold text-[#76243A]">
                No Transactions Found
              </h3>

              <p className="mt-2 text-sm text-[#94765F]">
                Transactions will appear here after payment records are saved.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>

                <TableHeader>
                  <TableRow className="bg-[#F8F5F0]">
                    <TableHead>Vendor</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Date</TableHead>
                    <TableHead>Invoice ID</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id || transaction.stripeInvoiceId}>

                      <TableCell>
                        <div className="min-w-[170px]">
                          <p className="font-medium text-[#76243A]">
                            {transaction.vendorName || "Unknown Vendor"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.vendorEmail}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {transaction.plan || "Premium"}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-semibold">
                        {formatAmount(
                          transaction.amount,
                          transaction.currency
                        )}
                      </TableCell>

                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm">
                        {transaction.createdAt
                          ? new Date(
                              transaction.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>

                      <TableCell>
                        <span
                          className="block max-w-[160px] truncate text-xs text-gray-500"
                          title={transaction.stripeInvoiceId}
                        >
                          {transaction.stripeInvoiceId || "N/A"}
                        </span>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </div>
          )}

        </CardContent>
      </Card>

      <p className="text-xs text-[#94765F]">
        Payment records are read-only. Payment status is verified and updated
        through Stripe webhooks.
      </p>

    </div>
  );
}
