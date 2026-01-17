import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= UI PROVIDERS ================= */
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/* ================= CONTEXT ================= */
import { NotificationProvider } from "@/context/NotificationContext";

/* ================= AUTH ================= */
import ProtectedRoute from "@/components/ProtectedRoute";

/* ================= PUBLIC / PATIENT PAGES ================= */
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import BookOPD from "@/pages/BookOPD";
import Doctors from "@/pages/Doctors";
import Hospitals from "@/pages/Hospitals";
import Appointments from "@/pages/Appointments";
import AppointmentDetail from "@/pages/AppointmentDetail";
import Consultation from "@/pages/Consultation";
import OnlineBooking from "@/pages/OnlineBooking";
import Room from "@/pages/Room";
import MedicalRecords from "@/pages/MedicalRecords";
import NotFound from "@/pages/NotFound";

/* ================= 🏥 HOSPITAL PAGES ================= */
import HospitalLayout from "@/hospital/layout/HospitalLayout";
import HospitalDashboard from "@/hospital/pages/Dashboard";
import HospitalAppointments from "@/hospital/pages/Appointments";
import HospitalPatients from "@/hospital/pages/Patients";
import HospitalDoctors from "@/hospital/pages/Doctors";
import HospitalRecords from "@/hospital/pages/Records";
import UploadReport from "@/hospital/pages/UploadReport";

const App = () => {
  return (
    <NotificationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= PATIENT ROUTES ================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-opd"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <BookOPD />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <Appointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <AppointmentDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/records"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />

            {/* ================= VIDEO CONSULTATION ================= */}
            <Route
              path="/room/:id"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <Room />
                </ProtectedRoute>
              }
            />

            <Route
              path="/consult"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <Consultation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/consult/book/:doctorId"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <OnlineBooking />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctors"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <Doctors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hospitals"
              element={
                <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
                  <Hospitals />
                </ProtectedRoute>
              }
            />

            {/* ================= 🏥 HOSPITAL ROUTES ================= */}
            <Route
              path="/hospital"
              element={
                <ProtectedRoute allowedRoles={["HOSPITAL", "ADMIN"]}>
                  <HospitalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<HospitalDashboard />} />
              <Route path="appointments" element={<HospitalAppointments />} />
              <Route path="patients" element={<HospitalPatients />} />
              <Route path="doctors" element={<HospitalDoctors />} />
              <Route path="records" element={<HospitalRecords />} />
              <Route
                path="upload-report/:appointmentId"
                element={<UploadReport />}
              />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationProvider>
  );
};

export default App;
