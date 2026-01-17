import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Star,
  User,
  Calendar,
  Video,
  Filter,
  ChevronDown,
} from "lucide-react";

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const specialties = [
    "All", "Cardiologist", "Orthopedic", "Neurologist", "Dermatologist",
    "Pediatrician", "General Physician", "ENT Specialist", "Ophthalmologist"
  ];

  // TODO: connect to GET /api/doctor
  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital, Delhi",
      experience: "15 years",
      rating: 4.9,
      reviews: 423,
      fee: 800,
      available: true,
      nextSlot: "Today, 4:00 PM",
      image: null,
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialty: "Orthopedic",
      hospital: "Fortis Healthcare, Mumbai",
      experience: "12 years",
      rating: 4.7,
      reviews: 315,
      fee: 600,
      available: true,
      nextSlot: "Tomorrow, 10:00 AM",
      image: null,
    },
    {
      id: 3,
      name: "Dr. Anita Desai",
      specialty: "Dermatologist",
      hospital: "Max Hospital, Bangalore",
      experience: "10 years",
      rating: 4.8,
      reviews: 289,
      fee: 700,
      available: false,
      nextSlot: "Jan 18, 2024",
      image: null,
    },
    {
      id: 4,
      name: "Dr. Vikram Singh",
      specialty: "Neurologist",
      hospital: "Medanta, Gurugram",
      experience: "18 years",
      rating: 4.9,
      reviews: 512,
      fee: 1000,
      available: true,
      nextSlot: "Today, 6:00 PM",
      image: null,
    },
    {
      id: 5,
      name: "Dr. Meena Patel",
      specialty: "Pediatrician",
      hospital: "AIIMS, Delhi",
      experience: "14 years",
      rating: 4.8,
      reviews: 378,
      fee: 500,
      available: true,
      nextSlot: "Today, 5:30 PM",
      image: null,
    },
    {
      id: 6,
      name: "Dr. Suresh Reddy",
      specialty: "General Physician",
      hospital: "Apollo Hospital, Chennai",
      experience: "20 years",
      rating: 4.6,
      reviews: 645,
      fee: 400,
      available: true,
      nextSlot: "Today, 3:00 PM",
      image: null,
    },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === "All" ||
      doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Find Doctors
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with verified specialist doctors
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Specialty Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty === "All" ? null : specialty)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                (specialty === "All" && !selectedSpecialty) || selectedSpecialty === specialty
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredDoctors.length} doctors
        </p>

        {/* Doctors List */}
        <div className="grid gap-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Doctor Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center">
                    <User className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
                      <p className="text-primary font-medium">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-highlight fill-highlight" />
                      <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {doctor.hospital}
                    </span>
                    <span>{doctor.experience} experience</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        doctor.available
                          ? "bg-accent-light text-accent"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      {doctor.nextSlot}
                    </span>
                    {doctor.available && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary">
                        <Video className="h-3 w-3" />
                        Video Consult Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Booking Section */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">₹{doctor.fee}</p>
                    <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="default" size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
