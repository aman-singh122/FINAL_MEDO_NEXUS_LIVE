import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  UploadCloud, 
  Link as LinkIcon, 
  CheckCircle, 
  AlertCircle,
  File,
  X
} from "lucide-react";
import API from "@/lib/axios";

const UploadReport = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // For visual realism
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ SAFETY CHECK
  if (!appointmentId) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 p-3 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">Invalid Appointment ID</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  /* ================= HANDLERS ================= */
  
  // Simulate a file selection for demo purposes
  const handleFakeFileSelect = () => {
    // In a real app, this would open a file picker -> upload to S3 -> get URL
    setFileUrl("https://example.com/medical-report-sample.pdf");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportType || !fileUrl) {
      setError("Please select a report type and provide a file URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Simulate progress bar
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 90) clearInterval(interval);
      }, 100);

      await API.post("/records/upload-report", {
        appointmentId,
        reportType,
        fileUrl
      });
      
      setUploadProgress(100);
      setSuccess("Report uploaded successfully to patient records.");

      setTimeout(() => {
        navigate("/hospital/appointments");
      }, 1500);

    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      
      {/* ================= HEADER ================= */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Appointments
      </button>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Upload Medical Record</h1>
          <p className="mt-1 text-sm text-slate-500">
            Attach diagnostic reports or prescriptions to the patient's history.
          </p>
        </div>

        {/* ================= CONTEXT CARD ================= */}
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
             <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Appointment Ref</p>
            <p className="font-mono text-sm font-medium text-slate-900">#{appointmentId}</p>
          </div>
        </div>

        {/* ================= FORM CARD ================= */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* 1. Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Report Category</label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading}
                >
                  <option value="" disabled>Select category...</option>
                  <option value="Blood Test">Blood Test / Hematology</option>
                  <option value="X-Ray">X-Ray / Radiography</option>
                  <option value="MRI">MRI Scan</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Prescription">Prescription / Rx</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                </select>
                {/* Custom arrow for styling consistency */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* 2. File Upload / URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Document Source</label>
              
              {/* Fake Drag & Drop Zone */}
              {!fileUrl ? (
                <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition-colors hover:bg-slate-100">
                   <UploadCloud className="mb-3 h-10 w-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                   <div className="text-center">
                     <p className="text-sm font-medium text-slate-700">
                       <button type="button" onClick={handleFakeFileSelect} className="text-blue-600 hover:underline font-semibold focus:outline-none">Click to upload</button> or drag and drop
                     </p>
                     <p className="mt-1 text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                   </div>
                   
                   {/* Divider */}
                   <div className="relative my-4 w-full px-6">
                     <div className="absolute inset-0 flex items-center px-6"><span className="w-full border-t border-slate-300"></span></div>
                     <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-500 group-hover:bg-slate-100">Or paste URL</span></div>
                   </div>

                   {/* URL Input */}
                   <div className="flex w-full max-w-sm items-center rounded-md border border-slate-300 bg-white px-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <LinkIcon className="mr-2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        className="w-full border-none py-2 text-sm focus:ring-0 placeholder:text-slate-400" 
                        placeholder="https://" 
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                      />
                   </div>
                </div>
              ) : (
                // Selected File Preview State
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-200 text-blue-700">
                      <File className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="truncate text-sm font-medium text-blue-900">{fileUrl}</p>
                      <p className="text-xs text-blue-600">Ready to upload</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFileUrl("")} 
                    className="ml-2 rounded p-1 text-blue-400 hover:bg-blue-200 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* STATUS MESSAGES */}
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    loading 
                    ? "cursor-not-allowed bg-blue-400" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Uploading ({uploadProgress}%)
                  </div>
                ) : (
                  "Upload Report"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;