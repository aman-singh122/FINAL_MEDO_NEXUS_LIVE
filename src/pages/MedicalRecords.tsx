import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyMedicalRecords } from "@/api/records.api";
import {
  Search,
  FileText,
  Calendar,
  User,
  Building2,
  Download,
  Eye,
  Pill,
  TestTube,
  Heart,
  X,
  Loader2,
  Filter,
  File,
  AlertCircle,
  Clock,
  Shield,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

interface UIRecord {
  id: string;
  type: "prescription" | "lab" | "diagnosis" | "other";
  title: string;
  doctor: string;
  hospital: string;
  date: string;
  description: string;
  fileUrl: string;
  fileSize?: string;
}

const BACKEND_BASE_URL = "http://localhost:5000";

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<UIRecord | null>(null);
  const [records, setRecords] = useState<UIRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await getMyMedicalRecords();
        const formatted: UIRecord[] = res.data.records.flatMap(
          (record: any) =>
            (record.reports || []).map((report: any) => {
              const fileUrl = report.fileUrl?.startsWith("http")
                ? report.fileUrl
                : `${BACKEND_BASE_URL}${report.fileUrl}`;

              const types = ["prescription", "lab", "diagnosis"];
              const reportType = report.reportType?.toLowerCase() || "";
              const type = types.find(t => reportType.includes(t)) || "other";

              return {
                id: `${record._id}-${report._id || Math.random()}`,
                type,
                title: report.reportType || "Medical Report",
                doctor: record.doctor?.doctorName || "General Physician",
                hospital: record.hospital?.hospitalName || "Medical Center",
                date: new Date(record.visitDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                description: report.description || "Medical report uploaded by provider",
                fileUrl,
                fileSize: `${Math.floor(Math.random() * 2000) + 500} KB`,
              };
            })
        );
        setRecords(formatted);
      } catch (err) {
        console.error("Failed to load medical records", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleDownload = async (url: string, filename: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "medical-report";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      window.open(url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "prescription": return Pill;
      case "lab": return TestTube;
      case "diagnosis": return Heart;
      default: return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case "prescription": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100" };
      case "lab": return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100" };
      case "diagnosis": return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", badge: "bg-rose-100" };
      default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", badge: "bg-gray-100" };
    }
  };

  const recordStats = {
    total: records.length,
    prescriptions: records.filter(r => r.type === "prescription").length,
    lab: records.filter(r => r.type === "lab").length,
    diagnosis: records.filter(r => r.type === "diagnosis").length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-lg" />
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600 text-sm mt-1">
                Your complete digital health history and reports
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
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
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{recordStats.total}</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1">
                  <Pill className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{recordStats.prescriptions}</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1">
                  <TestTube className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">{recordStats.lab}</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-rose-600" />
                  <span className="text-sm font-medium text-gray-700">{recordStats.diagnosis}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { id: "all", label: "All" },
                { id: "prescription", label: "Prescriptions" },
                { id: "lab", label: "Lab Reports" },
                { id: "diagnosis", label: "Diagnosis" },
              ].map((type) => {
                const colors = getRecordColor(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${
                      selectedType === type.id
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Records List */}
        {filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const colors = getRecordColor(record.type);
              const Icon = getRecordIcon(record.type);
              const isDownloading = downloadingId === record.id;

              return (
                <Card key={record.id} className="border border-gray-200 hover:border-blue-300 rounded-xl hover:shadow-sm transition-all">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${colors.bg} ${colors.border} border`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base truncate">{record.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`text-xs ${colors.badge} ${colors.text}`}>
                                {record.type}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <File className="h-3 w-3" />
                                <span>{record.fileSize}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{record.doctor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{record.hospital}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span>{record.date}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2">{record.description}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 bg-blue-600 hover:bg-blue-700"
                          disabled={isDownloading}
                          onClick={() => handleDownload(record.fileUrl, `${record.title}-${record.date}.pdf`, record.id)}
                        >
                          {isDownloading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-600 text-sm mb-6">
              {searchQuery || selectedType !== "all" 
                ? "Try adjusting your search or filters"
                : "No medical records available yet"
              }
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearchQuery(""); setSelectedType("all"); }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              <span>Secure & encrypted</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span>Available 24/7</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Download className="h-3.5 w-3.5 text-purple-500" />
              <span>Download anytime</span>
            </div>
          </div>
        </div>

        {/* Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" 
              onClick={() => setSelectedRecord(null)} 
            />
            <div className="relative bg-white rounded-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${getRecordColor(selectedRecord.type).bg}`}>
                      {(() => { 
                        const Icon = getRecordIcon(selectedRecord.type); 
                        return <Icon className="h-6 w-6" /> 
                      })()}
                    </div>
                    <div>
                      <Badge className={`${getRecordColor(selectedRecord.type).badge} ${getRecordColor(selectedRecord.type).text} text-xs`}>
                        {selectedRecord.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedRecord.title}</h2>
                    <p className="text-gray-600 text-sm">{selectedRecord.description}</p>
                  </div>

                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Doctor</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRecord.doctor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Hospital</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRecord.hospital}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Date</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRecord.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">File Size</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRecord.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 text-sm"
                    onClick={() => window.open(selectedRecord.fileUrl, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Preview
                  </Button>
                  <Button
                    className="flex-1 h-10 text-sm bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownload(selectedRecord.fileUrl, `${selectedRecord.title}.pdf`, "modal")}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;