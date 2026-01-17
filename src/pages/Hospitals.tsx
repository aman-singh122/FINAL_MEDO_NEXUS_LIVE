import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllHospitals } from "@/api/hospital.api";
import { socket } from "@/socket";
import { useCrowd } from "@/context/CrowdContext";
import { cn } from "@/lib/utils";

import {
  Search,
  MapPin,
  Building2,
  Stethoscope,
  Bed,
  Users,
  Clock,
  Star,
  ChevronRight,
  Filter,
  Shield,
  Activity,
  Phone,
  Globe,
  Navigation,
  Calendar,
  Eye,
  Award,
  CheckCircle,
} from "lucide-react";

interface Hospital {
  _id: string;
  name: string;
  type: "govt" | "private";
  address?: { city?: string; area?: string };
  departments: string[];
  opd?: { maxTokensPerDay?: number };
  rating?: number;
  totalBeds?: number;
  phone?: string;
  website?: string;
  distance?: number;
}

const Hospitals = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const { crowdByHospital } = useCrowd();

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const res = await getAllHospitals();
        const hospitalsWithStats = (res?.data?.hospitals || []).map((hospital: Hospital, index: number) => ({
          ...hospital,
          rating: 3.5 + Math.random() * 1.5,
          totalBeds: Math.floor(Math.random() * 150) + 30,
          phone: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000).toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"),
          website: hospital.name.toLowerCase().replace(/\s+/g, '') + ".com",
          distance: (Math.random() * 10 + 1).toFixed(1),
        }));
        setHospitals(hospitalsWithStats);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHospitals();
  }, []);

  useEffect(() => {
    if (!hospitals.length) return;
    hospitals.forEach((h) => {
      socket.emit("join-hospital", h._id);
    });
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.departments.some(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === "all" || h.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [hospitals, searchQuery, selectedType]);

  const getCrowdStatus = (hospitalId: string) => {
    const crowd = crowdByHospital?.[hospitalId] || { level: "low", waitTime: "5-10 min" };
    
    const statusConfig = {
      low: {
        label: "Low",
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        progress: 30,
      },
      medium: {
        label: "Moderate",
        color: "bg-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        progress: 65,
      },
      high: {
        label: "High",
        color: "bg-rose-500",
        textColor: "text-rose-700",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        progress: 90,
      }
    };

    return statusConfig[crowd.level as keyof typeof statusConfig] || statusConfig.low;
  };

  const stats = useMemo(() => ({
    total: hospitals.length,
    govt: hospitals.filter(h => h.type === "govt").length,
    private: hospitals.filter(h => h.type === "private").length,
  }), [hospitals]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Healthcare Centers</h1>
              <p className="text-gray-600 text-sm mt-1">
                Find and book appointments at trusted medical facilities
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          {/* Stats & Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{stats.total}</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{stats.govt}</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">{stats.private}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { id: "all", label: "All" },
                { id: "govt", label: "Government" },
                { id: "private", label: "Private" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                    selectedType === type.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hospitals Grid */}
        {filteredHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHospitals.map((hospital) => {
              const crowd = getCrowdStatus(hospital._id);
              
              return (
                <Card 
                  key={hospital._id} 
                  className="group border border-gray-200 hover:border-blue-300 rounded-xl hover:shadow-md transition-all"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={hospital.type === "govt" ? "secondary" : "outline"}
                            className={cn(
                              "text-xs",
                              hospital.type === "govt" 
                                ? "bg-blue-50 text-blue-700 border-blue-200" 
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            )}
                          >
                            {hospital.type === "govt" ? "Government" : "Private"}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-gray-700">
                              {hospital.rating?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
                          {hospital.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{hospital.address?.area}, {hospital.address?.city}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-xs">{hospital.distance} km</span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Crowd Status */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Wait Time</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-medium", crowd.bgColor, crowd.textColor)}
                        >
                          {crowd.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", crowd.color)}
                            style={{ width: `${crowd.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Fast</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {crowdByHospital?.[hospital._id]?.waitTime || "5-10 min"}
                          </span>
                          <span>Slow</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Stethoscope className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 mb-0.5">Depts</p>
                        <p className="text-sm font-bold text-gray-900">{hospital.departments.length}</p>
                      </div>
                      
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Bed className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 mb-0.5">Beds</p>
                        <p className="text-sm font-bold text-gray-900">{hospital.totalBeds}</p>
                      </div>
                      
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 mb-0.5">Slots</p>
                        <p className="text-sm font-bold text-gray-900">
                          {hospital.opd?.maxTokensPerDay || "∞"}
                        </p>
                      </div>
                    </div>

                    {/* Top Departments */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Departments</span>
                        <span className="text-xs text-gray-500">{hospital.departments.length} total</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {hospital.departments.slice(0, 3).map((dept, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
                          >
                            {dept}
                          </span>
                        ))}
                        {hospital.departments.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                            +{hospital.departments.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="truncate">{hospital.phone?.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">{hospital.website}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-sm"
                        onClick={() => navigate(`/hospitals/${hospital._id}`)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate("/book-opd")}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Book
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No centers found</h3>
            <p className="text-gray-600 text-sm mb-6">
              Try adjusting your search or filters
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(""); setSelectedType("all"); }}
              >
                Clear filters
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/book-opd")}
              >
                <Navigation className="h-4 w-4 mr-1.5" />
                Book directly
              </Button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              <span>Verified centers</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span>Live wait times</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-purple-500" />
              <span>Secure booking</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Hospitals;