
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  Plus,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Power,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  XCircle,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { toast } from "sonner";

// Backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Service categories
const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

// Get image from MongoDB service document
const getServiceImage = (service) => {
  if (Array.isArray(service.images)) {
    return service.images[0] || "";
  }

  return service.image || "";
};

export default function MyServicesPage() {
  // States
  const [services, setServices] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [saving, setSaving] = useState(false);

  // Get JWT token
  const getAuthHeaders = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication required. Please login again.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    };
  };

 
  
  // Fetch logged-in vendor's services
  const fetchMyServices = async () => {
    try {
      // First complete an async operation
      const headers = await getAuthHeaders();

setLoading(true);
setError("");

// Fetch subscription status
const subscriptionResponse = await fetch(
  `${API_URL}/subscription-status`,
  {
    method: "GET",
    headers,
  }
);

const subscriptionData = await subscriptionResponse.json();

if (subscriptionResponse.ok) {
  setIsPremium(
    subscriptionData.premium === true &&
    subscriptionData.subscriptionStatus === "active"
  );
}

// Fetch services
const response = await fetch(
  `${API_URL}/my-services`,
  {
    method: "GET",
    headers,
  }
);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch your services."
        );
      }

      const serviceList = Array.isArray(result)
        ? result
        : result.services || result.data || [];

      setServices(
        serviceList.map((service) => ({
          ...service,
          id: service._id || service.id,
          image: getServiceImage(service),
          status: (service.status || "pending").toLowerCase(),
          isActive: service.isActive ?? true,
        }))
      );

    } catch (err) {
      console.error("Fetch services error:", err);
      setError(err.message);
      toast.error(err.message);

    } finally {
      setLoading(false);
    }
  };


 useEffect(() => {
  const timer = setTimeout(() => {
    fetchMyServices();
  }, 0);

  return () => clearTimeout(timer);
}, []);

  // Statistics
  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.isActive
  ).length;

  const approvedServices = services.filter(
    (service) => service.status === "approved"
  ).length;

  const pendingServices = services.filter(
    (service) => service.status === "pending"
  ).length;

  const rejectedServices = services.filter(
    (service) => service.status === "rejected"
  ).length;

  // Search and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.serviceName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      service.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      service.status === statusFilter;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "active" && service.isActive) ||
      (availabilityFilter === "inactive" && !service.isActive);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesAvailability
    );
  });

  // Edit service
  const handleEditService = async () => {
    if (!editingService) return;

    try {
      setSaving(true);

      const headers = await getAuthHeaders();

      const updateData = {
        serviceName: editingService.serviceName,
        category: editingService.category,
        description: editingService.description,
        price: Number(editingService.price),
        location: editingService.location,
       images: editingService.image
  ? [editingService.image.trim()]
  : [],
      };

      const response = await fetch(
        `${API_URL}/services/${editingService.id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update service."
        );
      }

      toast.success("Service updated successfully!", {
        description: "Your service has been submitted for review.",
      });

      setEditingService(null);

      // Reload actual MongoDB data
      await fetchMyServices();
    } catch (err) {
      console.error("Update service error:", err);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete service
  const handleDeleteService = async (serviceId) => {
    // Backend DELETE endpoint needs to be implemented.
    toast.info("Delete API is not connected yet.", {
      description: "We need to add the vendor delete route on the server.",
    });
  };

  // Availability toggle
  const handleToggleAvailability = async (service) => {
    // Backend availability endpoint needs to be implemented.
    toast.info("Availability API is not connected yet.", {
      description: "We need to add the vendor availability route on the server.",
    });
  };

  // Status badge
  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    }

    if (status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        <XCircle className="mr-1 h-3 w-3" />
        Rejected
      </Badge>
    );
  };

  // Reset filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setAvailabilityFilter("all");
  };

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[3px] text-[#76243A]">
            Vendor Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#292321]">
            My Services
          </h1>

          <p className="mt-2 text-[#625B56]">
            Manage your wedding services and keep your listings up to date.
          </p>
        </div>

        <Link href="/vendor-dashboard/add-service">
          <Button className="bg-[#76243A] hover:bg-[#581525]">
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-[#E7DCCF] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#625B56]">
                Total Services
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#292321]">
                {totalServices}
              </h2>
            </div>
            <div className="rounded-xl bg-[#F1E8DC] p-3">
              <BriefcaseBusiness className="h-5 w-5 text-[#76243A]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E7DCCF] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#625B56]">
                Active Services
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#292321]">
                {activeServices}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3">
              <Power className="h-5 w-5 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E7DCCF] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#625B56]">
                Approved
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#292321]">
                {approvedServices}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E7DCCF] bg-white">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#625B56]">
                Pending Review
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#292321]">
                {pendingServices}
              </h2>
            </div>
            <div className="rounded-xl bg-yellow-100 p-3">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Free Plan Usage */}
      {/* Free Plan Usage */}
{!isPremium && (
  <Card className="border-[#E7DCCF] bg-[#F1E8DC]">
    <CardContent className="p-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h3 className="font-semibold text-[#292321]">
            Free Plan Usage
          </h3>

          <p className="mt-1 text-sm text-[#625B56]">
            You can have up to 3 active services on your Free plan.
          </p>
        </div>

        <div className="text-sm font-semibold text-[#76243A]">
          {activeServices}/3 Active Services
        </div>

      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#DCCDBD]">
        <div
          className="h-full rounded-full bg-[#76243A] transition-all"
          style={{
            width: `${Math.min((activeServices / 3) * 100, 100)}%`,
          }}
        />
      </div>

      {activeServices >= 3 && (
        <p className="mt-3 text-sm text-[#76243A]">
          You have reached your active service limit.
          Upgrade to Premium to activate unlimited services.
        </p>
      )}

      <div className="mt-4">
        <Link href="/vendor-dashboard/subscription">
          <Button
            variant="outline"
            className="border-[#76243A] text-[#76243A] hover:bg-[#76243A] hover:text-white"
          >
            Upgrade Plan
          </Button>
        </Link>
      </div>

    </CardContent>
  </Card>
)}

      {/* Search and Filters */}
      <Card className="border-[#E7DCCF] bg-white">
        <CardContent className="p-5">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94765F]" />

              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="border-[#E7DCCF] pl-9 focus-visible:ring-[#76243A]"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="border-[#E7DCCF]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="border-[#E7DCCF]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={availabilityFilter}
              onValueChange={setAvailabilityFilter}
            >
              <SelectTrigger className="border-[#E7DCCF]">
                <SelectValue placeholder="All Availability" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

          </div>

        </CardContent>
      </Card>

      {/* Your Listings */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#292321]">
            Your Listings
          </h2>

          <p className="mt-1 text-sm text-[#625B56]">
            Showing {filteredServices.length} of {totalServices} services
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={fetchMyServices}
          disabled={loading}
          className="border-[#E7DCCF] text-[#76243A]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#E7DCCF] bg-white py-20">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-[#76243A]" />
          <p className="text-sm text-[#625B56]">
            Loading your services...
          </p>
        </div>
      ) : error ? (
        /* Error State */
        <Card className="border-red-200 bg-white">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <XCircle className="mb-4 h-10 w-10 text-red-500" />

            <h3 className="text-xl font-semibold text-[#292321]">
              Unable to Load Services
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#625B56]">
              {error}
            </p>

            <Button
              onClick={fetchMyServices}
              className="mt-5 bg-[#76243A] hover:bg-[#581525]"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredServices.length > 0 ? (

        /* Services Grid */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {filteredServices.map((service) => (

            <Card
              key={service.id}
              className="overflow-hidden border-[#E7DCCF] bg-white transition-shadow hover:shadow-md"
            >

              {/* Large Image - Starts at the top */}
              <div className="relative h-75 w-full overflow-hidden bg-[#F1E8DC]">

                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.serviceName}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-14 w-14 text-[#94765F]" />
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  {getStatusBadge(service.status)}
                </div>

                <div className="absolute right-4 top-4">
                  <Badge
                    className={
                      service.isActive
                        ? "bg-white text-green-700 hover:bg-white"
                        : "bg-white text-gray-600 hover:bg-white"
                    }
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

              </div>

              {/* Service Information */}
              <CardContent className="space-y-4 p-5">

                <div>
                  <p className="text-sm font-medium text-[#94765F]">
                    {service.category}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-[#292321]">
                    {service.serviceName}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#625B56]">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div className="flex items-center gap-1.5 text-sm text-[#625B56]">
                    <MapPin className="h-4 w-4 text-[#94765F]" />
                    {service.location}
                  </div>

                  <p className="text-lg font-bold text-[#76243A]">
            <i className="fa-solid fa-bangladeshi-taka-sign"></i>
                    {Number(service.price || 0).toLocaleString("en-BD")}
                  </p>

                </div>

                <div className="border-t border-[#E7DCCF] pt-4">

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Availability */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAvailability(service)}
                      className={
                        service.isActive
                          ? "border-green-200 text-green-700 hover:bg-green-50"
                          : "border-[#E7DCCF] text-[#625B56]"
                      }
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {service.isActive ? "Deactivate" : "Activate"}
                    </Button>

                    {/* Actions */}
                    <div className="flex items-center gap-2">

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingService({ ...service })}
                        className="border-[#E7DCCF] text-[#76243A] hover:bg-[#F1E8DC]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedService(service)}
                        className="border-[#E7DCCF] text-[#76243A] hover:bg-[#F1E8DC]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteService(service.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>
                  </div>

                  {service.status === "rejected" && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      Your service was rejected. Please review and update the service information.
                    </div>
                  )}

                  {service.status === "pending" && (
                    <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                      Your service is waiting for admin review.
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>

          ))}

        </div>

      ) : (

        /* Empty State */
        <Card className="border-[#E7DCCF] bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">

            <div className="mb-4 rounded-full bg-[#F1E8DC] p-5">
              <ImageIcon className="h-8 w-8 text-[#94765F]" />
            </div>

            <h3 className="text-xl font-semibold text-[#292321]">
              {totalServices === 0
                ? "No Services Added Yet"
                : "No Services Found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#625B56]">
              {totalServices === 0
                ? "You haven't added any services yet. Start showcasing your wedding services!"
                : "No services match your current search or filters."}
            </p>

            {totalServices === 0 ? (
              <Link href="/vendor-dashboard/add-service">
                <Button className="mt-5 bg-[#76243A] hover:bg-[#581525]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Service
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="mt-5 border-[#76243A] text-[#76243A]"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}

          </CardContent>
        </Card>
      )}

      {/* Edit Service Dialog */}
      <Dialog
        open={!!editingService}
        onOpenChange={(open) => {
          if (!open) setEditingService(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">

          <DialogHeader>
            <DialogTitle className="text-[#292321]">
              Edit Service
            </DialogTitle>

            <DialogDescription>
              Update your service information. Changes will be submitted for admin review.
            </DialogDescription>
          </DialogHeader>

          {editingService && (
            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium text-[#292321]">
                  Service Name
                </label>

                <Input
                  value={editingService.serviceName || ""}
                  onChange={(event) =>
                    setEditingService({
                      ...editingService,
                      serviceName: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#292321]">
                  Category
                </label>

                <Select
                  value={editingService.category}
                  onValueChange={(value) =>
                    setEditingService({
                      ...editingService,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#292321]">
                  Description
                </label>

                <textarea
                  value={editingService.description || ""}
                  onChange={(event) =>
                    setEditingService({
                      ...editingService,
                      description: event.target.value,
                    })
                  }
                  rows={4}
                  className="w-full rounded-md border border-[#E7DCCF] bg-white px-3 py-2 text-sm outline-none focus:border-[#76243A] focus:ring-1 focus:ring-[#76243A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#292321]">
                  Price (৳)
                </label>

                <Input
                  type="number"
                  min="1"
                  value={editingService.price ?? ""}
                  onChange={(event) =>
                    setEditingService({
                      ...editingService,
                      price: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#292321]">
                  Location
                </label>

                <Input
                  value={editingService.location || ""}
                  onChange={(event) =>
                    setEditingService({
                      ...editingService,
                      location: event.target.value,
                    })
                  }
                />
              </div>

               <div>
      <label className="mb-2 block text-sm font-medium text-[#292321]">
        Service Image URL
      </label>

      <Input
        type="url"
        placeholder="Paste your ImgBB Direct Link"
        value={editingService.image || ""}
        onChange={(event) =>
          setEditingService({
            ...editingService,
            image: event.target.value,
          })
        }
      />

      {editingService.image && (
        <img
          src={editingService.image}
          alt="Service preview"
          className="mt-3 h-40 w-full rounded-lg border border-[#E7DCCF] object-cover"
        />
      )}

      <p className="mt-2 text-xs text-[#94765F]">
        Upload your image to ImgBB and paste the Direct Link here.
      </p>
    </div>

  </div>
)}

       



          <DialogFooter className="mt-4">

            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setEditingService(null)}
            >
              Cancel
            </Button>

            <Button
              disabled={saving}
              onClick={handleEditService}
              className="bg-[#76243A] hover:bg-[#581525]"
            >
              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Details Dialog */}
      <Dialog
        open={!!selectedService}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">

          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#292321]">
                  {selectedService.serviceName}
                </DialogTitle>

                <DialogDescription>
                  Service details and listing information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">

                {selectedService.image && (
                  <img
                    src={selectedService.image}
                    alt={selectedService.serviceName}
                    className="h-64 w-full rounded-lg object-cover"
                  />
                )}

                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedService.status)}

                  <Badge variant="outline">
                    {selectedService.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-[#94765F]">
                    Category
                  </p>

                  <p className="font-medium text-[#292321]">
                    {selectedService.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#94765F]">
                    Description
                  </p>

                  <p className="text-sm leading-6 text-[#625B56]">
                    {selectedService.description}
                  </p>
                </div>

                <div className="flex justify-between border-t border-[#E7DCCF] pt-4">

                  <div>
                    <p className="text-sm text-[#94765F]">
                      Location
                    </p>

                    <p className="font-medium text-[#292321]">
                      {selectedService.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-[#94765F]">
                      Price
                    </p>

                    <p className="text-xl font-bold text-[#76243A]">
                      ৳{Number(selectedService.price || 0).toLocaleString("en-BD")}
                    </p>
                  </div>

                </div>
              </div>

              <DialogFooter>

                <Button
                  variant="outline"
                  onClick={() => setSelectedService(null)}
                >
                  Close
                </Button>

                <Button
                  onClick={() => {
                    setEditingService({ ...selectedService });
                    setSelectedService(null);
                  }}
                  className="bg-[#76243A] hover:bg-[#581525]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Service
                </Button>

              </DialogFooter>
            </>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}
