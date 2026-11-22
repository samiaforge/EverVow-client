
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Search,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  BriefcaseBusiness,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedService, setSelectedService] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch all services

  useEffect(() => {
  let isMounted = true;

  const loadServices = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/admin/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch services");
      }

      if (isMounted) {
        setServices(
          Array.isArray(result)
            ? result
            : result.services || []
        );
      }
    } catch (error) {
      console.error("Fetch Services Error:", error);

      if (isMounted) {
        toast.error(error.message || "Failed to load services");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadServices();

  return () => {
    isMounted = false;
  };
}, []);

  // Approve / Reject service
  const handleStatusChange = async (service, status) => {
    const id = service._id;

    try {
      setUpdating(id);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/services/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, status }
            : item
        )
      );

      toast.success(
        status === "approved"
          ? "Service approved successfully"
          : "Service rejected successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  // Activate / Deactivate service
  const handleAvailability = async (service) => {
    try {
      setUpdating(service._id);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            isActive: !service.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Availability update failed");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, isActive: !service.isActive }
            : item
        )
      );

      toast.success(
        service.isActive
          ? "Service deactivated"
          : "Service activated"
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setUpdating(null);
    }
  };

  // Delete service
  const handleDelete = async (service) => {
    if (!window.confirm(`Delete ${service.serviceName}?`)) return;

    try {
      setUpdating(service._id);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/services/${service._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setServices((previous) =>
        previous.filter((item) => item._id !== service._id)
      );

      toast.success("Service deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Delete failed");
    } finally {
      setUpdating(null);
    }
  };

  // Filtering
  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      service.serviceName?.toLowerCase().includes(searchText) ||
      service.vendorName?.toLowerCase().includes(searchText) ||
      service.vendorEmail?.toLowerCase().includes(searchText) ||
      service.category?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return (
      <Badge className={styles[status] || "bg-gray-100 text-gray-700"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  const pendingCount = services.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = services.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = services.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#94765F]">
          Administration
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#76243A] md:text-3xl">
          Manage Services
        </h2>

        <p className="mt-2 text-sm text-[#625B56]">
          Review, approve and manage vendor submitted services.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {[
          { label: "Total Services", value: services.length },
          { label: "Pending", value: pendingCount },
          { label: "Approved", value: approvedCount },
          { label: "Rejected", value: rejectedCount },
        ].map((item) => (
          <Card key={item.label} className="border-[#E8DDD0] bg-white">
            <CardContent className="p-5">
              <p className="text-sm text-[#94765F]">{item.label}</p>
              <h3 className="mt-2 text-2xl font-bold text-[#76243A]">
                {item.value}
              </h3>
            </CardContent>
          </Card>
        ))}

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
              placeholder="Search service or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="overflow-hidden border-[#E8DDD0] bg-white">
        <CardContent className="p-0">

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2 className="animate-spin text-[#76243A]" size={35} />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center">
              <BriefcaseBusiness size={40} className="text-[#94765F]" />
              <h3 className="mt-3 font-semibold text-[#76243A]">
                No Services Found
              </h3>
              <p className="mt-1 text-sm text-[#94765F]">
                Try another search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8F5F0]">
                    <TableHead>Service</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service._id}>

                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[180px]">
                          {service.images?.[0] && (
                            <img
                              src={service.images[0]}
                              alt={service.serviceName}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          )}

                          <span className="font-medium text-[#76243A]">
                            {service.serviceName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="min-w-[150px]">
                          <p className="font-medium">{service.vendorName}</p>
                          <p className="text-xs text-gray-500">
                            {service.vendorEmail}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{service.category}</TableCell>

                      <TableCell>
                        ৳{Number(service.price || 0).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(service.status)}
                          <p className="text-xs text-gray-500">
                            {service.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-2">

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setSelectedService(service);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye size={16} />
                          </Button>

                          {service.status !== "approved" && (
                            <Button
                              size="icon"
                              disabled={updating === service._id}
                              onClick={() =>
                                handleStatusChange(service, "approved")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}

                          {service.status !== "rejected" && (
                            <Button
                              size="icon"
                              variant="destructive"
                              disabled={updating === service._id}
                              onClick={() =>
                                handleStatusChange(service, "rejected")
                              }
                            >
                              <XCircle size={16} />
                            </Button>
                          )}

                          {service.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === service._id}
                              onClick={() => handleAvailability(service)}
                            >
                              {service.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          )}

                          <Button
                            size="icon"
                            variant="outline"
                            disabled={updating === service._id}
                            onClick={() => handleDelete(service)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>

                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Service Details */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#76243A]">
              Service Details
            </DialogTitle>
            <DialogDescription>
              Review vendor submitted service information.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">

              {selectedService.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={selectedService.serviceName}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ))}

              <h3 className="text-xl font-bold text-[#76243A]">
                {selectedService.serviceName}
              </h3>

              <p className="text-sm text-gray-600">
                {selectedService.description}
              </p>

              <div className="space-y-2 rounded-xl bg-[#F8F5F0] p-4 text-sm">
                <p><strong>Vendor:</strong> {selectedService.vendorName}</p>
                <p><strong>Email:</strong> {selectedService.vendorEmail}</p>
                <p><strong>Category:</strong> {selectedService.category}</p>
                <p><strong>Location:</strong> {selectedService.location}</p>
                <p><strong>Price:</strong> ৳{selectedService.price}</p>
                <p><strong>Status:</strong> {selectedService.status}</p>
                <p>
                  <strong>Submitted:</strong>{" "}
                  {selectedService.createdAt
                    ? new Date(selectedService.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
