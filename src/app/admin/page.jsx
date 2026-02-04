"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    verifyAdmin,
    getAllMarkings,
    getMarkingStats,
} from "../../../actions/adminActions";
import {
    updateMarkingStatus,
    generateAISummary,
} from "../../../actions/markingActions";
import { getUser } from "../../../actions/userActions";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Sparkles,
    Search,
    AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [markings, setMarkings] = useState([]);
    const [filteredMarkings, setFilteredMarkings] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMarking, setSelectedMarking] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verify admin access
    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to access admin dashboard");
                router.push("/login");
                return;
            }

            const response = await verifyAdmin(token);
            if (!response.success) {
                toast.error(response.error || "Unauthorized access");
                router.push("/home");
                return;
            }

            const userResponse = await getUser(token);
            if (userResponse.success) {
                setUser(userResponse.user);
            }
            setIsLoading(false);
        };

        checkAdmin();
    }, [router]);

    // Fetch markings and stats
    const fetchData = useCallback(async () => {
        const [markingsResponse, statsResponse] = await Promise.all([
            getAllMarkings(),
            getMarkingStats(),
        ]);

        if (markingsResponse.success) {
            setMarkings(markingsResponse.data);
            setFilteredMarkings(markingsResponse.data);
        } else {
            toast.error("Failed to fetch markings");
        }

        if (statsResponse.success) {
            setStats(statsResponse.data);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && user) {
            fetchData();
        }
    }, [isLoading, user, fetchData]);

    // Filter markings
    useEffect(() => {
        let filtered = markings;

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((m) => m.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (m) =>
                    m.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.markedBy?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.markedBy?.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredMarkings(filtered);
    }, [statusFilter, searchQuery, markings]);

    // Handle status update
    const handleStatusUpdate = async (markingId, newStatus) => {
        if (!user) return;

        const response = await updateMarkingStatus(markingId, newStatus, user._id);
        if (response.success) {
            toast.success(`Marking ${newStatus} successfully`);
            fetchData();
            setIsDialogOpen(false);
        } else {
            toast.error(response.error || "Failed to update marking");
        }
    };

    // Handle AI summary generation
    const handleGenerateAI = async (marking) => {
        setIsGeneratingAI(true);
        const response = await generateAISummary(
            marking._id,
            marking.location,
            marking.comment
        );

        if (response.success) {
            toast.success("AI summary generated successfully");
            // Update the marking in the list
            setMarkings((prev) =>
                prev.map((m) => (m._id === marking._id ? response.data : m))
            );
            setSelectedMarking(response.data);
        } else {
            toast.error(response.error || "Failed to generate AI summary");
        }
        setIsGeneratingAI(false);
    };

    // Open marking details dialog
    const openMarkingDetails = (marking) => {
        setSelectedMarking(marking);
        setIsDialogOpen(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case "approved":
                return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case "rejected":
                return <Badge variant="outline" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getMarkTypeBadge = (markType) => {
        return markType === 1 ? (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Unsafe</Badge>
        ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700"><AlertTriangle className="w-3 h-3 mr-1" />Danger</Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage and verify place markings</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Markings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">Rejected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by comment, username, or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Markings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Place Markings</CardTitle>
                    <CardDescription>
                        {filteredMarkings.length} marking(s) found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMarkings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                            No markings found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMarkings.map((marking) => (
                                        <TableRow key={marking._id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{marking.markedBy?.username || "Unknown"}</div>
                                                    <div className="text-sm text-gray-500">{marking.markedBy?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{marking.comment}</TableCell>
                                            <TableCell>{getMarkTypeBadge(marking.markType)}</TableCell>
                                            <TableCell>{getStatusBadge(marking.status)}</TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(marking.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openMarkingDetails(marking)}
                                                >
                                                    Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Marking Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Marking Details</DialogTitle>
                        <DialogDescription>
                            Review and verify this place marking
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMarking && (
                        <div className="space-y-4">
                            {/* User Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Reported By</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p><strong>Username:</strong> {selectedMarking.markedBy?.username}</p>
                                        <p><strong>Email:</strong> {selectedMarking.markedBy?.email}</p>
                                        <p><strong>Phone:</strong> {selectedMarking.markedBy?.phoneNo}</p>
                                        <p><strong>Date:</strong> {new Date(selectedMarking.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Marking Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Marking Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <strong>Type:</strong> {getMarkTypeBadge(selectedMarking.markType)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <strong>Status:</strong> {getStatusBadge(selectedMarking.status)}
                                    </div>
                                    <div>
                                        <strong>Comment:</strong>
                                        <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedMarking.comment}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <strong>Location:</strong>
                                            <span className="text-sm text-gray-600">
                                                {selectedMarking.location.lat.toFixed(6)}, {selectedMarking.location.lng.toFixed(6)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => {
                                                const url = `https://www.google.com/maps?q=${selectedMarking.location.lat},${selectedMarking.location.lng}`;
                                                window.open(url, '_blank');
                                            }}
                                        >
                                            <MapPin className="w-4 h-4 mr-2" />
                                            View on Google Maps
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* AI Summary */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            AI Safety Analysis
                                        </CardTitle>
                                        {!selectedMarking.aiSummary && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGenerateAI(selectedMarking)}
                                                disabled={isGeneratingAI}
                                            >
                                                {isGeneratingAI ? "Generating..." : "Generate AI Summary"}
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {selectedMarking.aiSummary ? (
                                        <div className="p-3 bg-blue-50 rounded-md text-sm">
                                            {selectedMarking.aiSummary}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">
                                            No AI summary generated yet. Click the button above to generate one.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {selectedMarking.status === "pending" && (
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleStatusUpdate(selectedMarking._id, "approved")}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Marking
                                    </Button>
                                    <Button
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                        onClick={() => handleStatusUpdate(selectedMarking._id, "rejected")}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject Marking
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
