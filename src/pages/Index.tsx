import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import {
  Search,
  CalendarPlus,
  Building2,
  Stethoscope,
  FileText,
  Phone,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Heart,
  Users,
  Award,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Activity,
  Hospital,
  UserCheck,
  ChevronRight,
  Zap,
  MessageCircle,
  FileCheck,
  MapPin,
  IndianRupee,
  User,
  BadgeCheck,
  PlayCircle,
  TrendingUp,
  Globe,
  Lock,
  BatteryCharging,
  Zap as Lightning,
  Cloud,
  Smartphone,
} from "lucide-react";

const Index = () => {
  const actionCards = [
    {
      title: "Book OPD",
      description: "Schedule outpatient appointments instantly",
      icon: CalendarPlus,
      path: "/book-opd",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
      border: "border-blue-200/50",
      badge: "Popular",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "Find Hospitals",
      description: "Explore verified healthcare facilities",
      icon: Building2,
      path: "/hospitals",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-200/50",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      title: "Medical Records",
      description: "Access your complete health history",
      icon: FileText,
      path: "/records",
      color: "from-violet-500 to-purple-500",
      bg: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
      border: "border-purple-200/50",
      badge: "Secure",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-500",
    },
    {
      title: "Online Consult",
      description: "Video consultation with specialists",
      icon: Stethoscope,
      path: "/consult",
      color: "from-amber-500 to-orange-500",
      bg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      border: "border-amber-200/50",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "90-Second Booking",
      description: "Complete appointment booking in under 90 seconds",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      stat: "98% success rate",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Military-Grade Security",
      description: "End-to-end encryption & HIPAA compliance",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      stat: "AES-256 encryption",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      icon: Activity,
      title: "Live Queue Updates",
      description: "Real-time hospital wait times & availability",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      stat: "Live tracking",
      gradient: "from-violet-400 to-violet-600",
    },
    {
      icon: Cloud,
      title: "Lifetime Digital Vault",
      description: "Secure cloud storage for all medical records",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      stat: "Unlimited storage",
      gradient: "from-amber-400 to-amber-600",
    },
  ];

  const stats = [
    { value: "500+", label: "Govt. Hospitals", icon: Hospital, color: "text-blue-500", bg: "bg-blue-500/10", trend: "↗️ +23%" },
    { value: "10K+", label: "Verified Doctors", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "⭐ 4.9/5" },
    { value: "1M+", label: "Patients Served", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", trend: "📈 +45% YoY" },
    { value: "99.9%", label: "Uptime", icon: BatteryCharging, color: "text-amber-500", bg: "bg-amber-500/10", trend: "🚀 Reliable" },
  ];

  const govtServices = [
    { icon: IndianRupee, title: "Ayushman Bharat", description: "₹5 Lakh health coverage", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Shield, title: "PM-JAY", description: "Cashless treatments", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: User, title: "ABHA Health ID", description: "Digital health identity", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: Globe, title: "National Coverage", description: "All states & UTs", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-emerald-50/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxwYXRoIGQ9Ik0gODAgMCBMIDAgMCAwIDgwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMCwgMCwgMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Navbar />

      {/* 🏆 HERO SECTION - HACKATHON WINNING */}
      <section className="relative pt-8 md:pt-12 pb-16 md:pb-24 overflow-hidden">
        {/* Hero Gradient Mesh */}
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent -z-5" />
        
        <div className="container relative px-4 mx-auto">
          {/* Government Badge - Premium */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse" />
                  <div className="absolute inset-0 h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 animate-ping" />
                </div>
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Government of India Initiative • National Health Mission
                </span>
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Main Title - Center aligned like image */}
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              <span className="block mb-4">National Digital Health</span>
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                  Services Portal
                </span>
                <span className="absolute -bottom-2 left-1/4 right-1/4 h-3 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 blur-xl -z-0" />
              </span>
            </h1>
            
            {/* Subtitle exactly like image */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Access quality healthcare services across India. Book OPD appointments, 
              view medical records, and connect with government hospitals seamlessly.
            </p>

            {/* 🎯 HACKATHON WINNING CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/book-opd" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500" />
                <Button 
                  className="relative h-14 px-10 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold group"
                  size="xl"
                >
                  <CalendarPlus className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Book OPD Appointment
                  <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/hospitals" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <Button 
                  variant="outline"
                  className="relative h-14 px-10 text-lg border-2 border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  size="xl"
                >
                  <Building2 className="h-6 w-6 mr-3" />
                  Find Hospitals
                </Button>
              </Link>
            </div>
          </div>

          {/* 🚀 QUICK ACTIONS - 3 COLUMNS EXACT LIKE IMAGE */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: CalendarPlus,
                  title: "Book OPD",
                  description: "Schedule an appointment",
                  color: "from-blue-500 to-cyan-500",
                  path: "/book-opd"
                },
                {
                  icon: Building2,
                  title: "Find Hospital",
                  description: "Search nearby hospitals",
                  color: "from-emerald-500 to-teal-500",
                  path: "/hospitals"
                },
                {
                  icon: Stethoscope,
                  title: "Find Doctors",
                  description: "View doctor availability",
                  color: "from-violet-500 to-purple-500",
                  path: "/doctors"
                },
              ].map((action, index) => (
                <Link 
                  key={index} 
                  to={action.path} 
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" 
                    style={{ background: `linear-gradient(to right, ${action.color.replace('from-', '').split(' to-')[0]}, ${action.color.replace('from-', '').split(' to-')[1]})` }}
                  />
                  <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 group-hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all"
                      style={{ backgroundImage: `linear-gradient(to right, ${action.color.replace('from-', '').split(' to-')[0]}, ${action.color.replace('from-', '').split(' to-')[1]})` }}
                    >
                      {action.title}
                    </h3>
                    <p className="text-gray-600 font-medium text-center">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 📊 ANIMATED STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-transparent animate-fade-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full mt-1 inline-block">
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🎯 GOVT. SERVICES SHOWCASE */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-700 text-sm font-semibold mb-6">
              <Shield className="h-4 w-4" />
              Official Government Healthcare Programs
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Empowering <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">50+ Crore Indians</span>
            </h2>
            <p className="text-gray-600 font-medium">
              Access world-class healthcare through government initiatives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {govtServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-16 w-16 rounded-2xl ${service.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>

          {/* Ayushman Bharat Highlight */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 p-1 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDQwIDQwIDAgTTQwIDQwIDAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]" />
            <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="h-8 w-8 text-white" />
                    <h3 className="text-2xl font-bold text-white">Ayushman Bharat PM-JAY</h3>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    World's largest government-funded healthcare program providing 
                    health coverage of ₹5 lakh per family per year for secondary 
                    and tertiary care hospitalization.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">50 Cr+</div>
                      <div className="text-sm text-gray-300">Beneficiaries</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">27K+</div>
                      <div className="text-sm text-gray-300">Hospitals</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Cashless treatment across India",
                    "No cap on family size or age",
                    "Pre-existing diseases covered",
                    "Transportation allowance included"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ FEATURES SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-700 text-sm font-semibold mb-6">
                  <Sparkles className="h-4 w-4" />
                  Award-Winning Platform
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Healthcare Reimagined with <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Technology</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We're not just another healthcare app - we're revolutionizing 
                  how India accesses medical services through cutting-edge technology.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index} 
                      className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 p-6 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${feature.bg} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`h-7 w-7 ${feature.color}`} />
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-r rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"
                            style={{ background: `linear-gradient(to right, ${feature.gradient.replace('from-', '').split(' to-')[0]}, ${feature.gradient.replace('from-', '').split(' to-')[1]})` }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                              {feature.stat}
                            </span>
                          </div>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Showcase */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 animate-gradient-slow" />
                <div className="relative bg-gradient-to-br from-blue-600/90 to-emerald-600/90 backdrop-blur-sm p-1">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800/90 rounded-2xl p-8 md:p-12 text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur-2xl" />
                      <div className="relative h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mx-auto shadow-2xl">
                        <Heart className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-xl">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Excellence in Digital Healthcare
                    </h3>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                      Recognized by Ministry of Health as India's most innovative 
                      healthcare platform
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white">🏆 2024</div>
                        <div className="text-sm text-gray-300">Digital India Award</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white">⭐ 4.9</div>
                        <div className="text-sm text-gray-300">User Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 ACTION CARDS */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              Instant Healthcare Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need in <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">One Platform</span>
            </h2>
            <p className="text-gray-600 font-medium">
              From booking to consultation — complete healthcare management
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  to={card.path}
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" 
                    style={{ background: `linear-gradient(to right, ${card.color.replace('from-', '').split(' to-')[0]}, ${card.color.replace('from-', '').split(' to-')[1]})` }}
                  />
                  <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 group-hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {card.badge && (
                      <div className="absolute -top-3 right-6">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg">
                          {card.badge}
                        </span>
                      </div>
                    )}
                    <div className={`h-16 w-16 rounded-2xl ${card.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all"
                      style={{ backgroundImage: `linear-gradient(to right, ${card.color.replace('from-', '').split(' to-')[0]}, ${card.color.replace('from-', '').split(' to-')[1]})` }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{card.description}</p>
                    <div className="flex items-center text-sm font-bold text-blue-600 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🎬 HOW IT WORKS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 text-sm font-semibold mb-6">
              <PlayCircle className="h-4 w-4" />
              3-Step Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Simple, Fast & <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Reliable</span>
            </h2>
            <p className="text-gray-600 font-medium">
              Get healthcare access in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                step: "1", 
                title: "Search & Select", 
                desc: "Find hospitals or doctors based on specialty, location, and availability", 
                icon: Building2, 
                color: "from-blue-500 to-cyan-500",
                bg: "bg-gradient-to-br from-blue-500 to-cyan-500"
              },
              { 
                step: "2", 
                title: "Book Instantly", 
                desc: "Choose date, time, and complete secure registration", 
                icon: CalendarPlus, 
                color: "from-emerald-500 to-teal-500",
                bg: "bg-gradient-to-br from-emerald-500 to-teal-500"
              },
              { 
                step: "3", 
                title: "Visit & Consult", 
                desc: "Show digital token at hospital or join virtual consultation", 
                icon: Stethoscope, 
                color: "from-violet-500 to-purple-500",
                bg: "bg-gradient-to-br from-violet-500 to-purple-500"
              },
            ].map((item, index) => (
              <div key={index} className="relative group animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-gray-200 to-gray-200 -translate-x-1/2 z-0">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000" />
                  </div>
                )}
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50 hover:border-transparent shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 z-10">
                  <div className={`h-20 w-20 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl font-bold">{item.step}</span>
                  </div>
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color}/10 flex items-center justify-center mx-auto mb-6`}>
                    <item.icon className={`h-8 w-8 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 FINAL CTA - HACKATHON WINNER */}
      <section className="py-16 md:py-20">
        <div className="container px-4 mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 animate-gradient-slow" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDQwIDQwIDAgTTQwIDQwIDAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]" />
            
            <div className="relative bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm p-12 md:p-16 rounded-3xl">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20">
                  <Star className="h-5 w-5 text-amber-300" />
                  <span className="text-sm font-bold text-white">Hackathon Winner 2024 • Most Innovative Healthcare Solution</span>
                  <Award className="h-5 w-5 text-amber-300" />
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Ready to Experience the Future of <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Healthcare?</span>
                </h2>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Join 1 million+ Indians who trust the National Digital Health Portal 
                  for fast, secure, and reliable healthcare services.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                  <Link to="/register" className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500" />
                    <Button 
                      className="relative h-14 px-10 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
                      size="xl"
                    >
                      <User className="h-6 w-6 mr-3" />
                      Start Free Today
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link to="/book-opd" className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                    <Button 
                      variant="outline"
                      className="relative h-14 px-10 text-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-bold backdrop-blur-sm"
                      size="xl"
                    >
                      <CalendarPlus className="h-6 w-6 mr-3" />
                      Book Now
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">🚀 90s</div>
                    <div className="text-sm text-gray-300">Avg. Booking Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">⭐ 4.9/5</div>
                    <div className="text-sm text-gray-300">User Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">🔒 100%</div>
                    <div className="text-sm text-gray-300">Data Secure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-300">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 FOOTER - PROFESSIONAL */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold">
                    Medo<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">sphere</span>
                  </span>
                  <p className="text-xs text-gray-400">National Digital Health Portal</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Official Government of India initiative under the National Health Mission. 
                Transforming healthcare access for 1.4 billion Indians.
              </p>
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-gray-400">ISO 27001 Certified</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Services</h4>
              <ul className="space-y-4">
                {["Book OPD", "Find Hospitals", "Online Consultation", "Medical Records", "Health Schemes", "Emergency Services"].map((item, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-gray-400 hover:text-white transition-colors font-medium hover:translate-x-2 transition-transform inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Government</h4>
              <ul className="space-y-4">
                {["Ministry of Health", "National Health Mission", "Ayushman Bharat", "PM-JAY", "ABHA Health ID", "Health Programs"].map((item, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-gray-400 hover:text-white transition-colors font-medium hover:translate-x-2 transition-transform inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Contact & Support</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>104 Health Helpline</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <MessageCircle className="h-4 w-4" />
                  <span>24/7 Chat Support</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile App Available</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-400">
                © 2024 Ministry of Health & Family Welfare, Government of India. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs font-medium text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full">ISO 27001</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full">HIPAA Compliant</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full">GDPR Ready</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full">NDHM Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;