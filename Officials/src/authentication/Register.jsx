import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  MapPin,
  Shield,
  Upload,
  CheckCircle,
  ChevronLeft,
  AlertCircle,
  IdCard,
  Calendar,
  FileText,
  Briefcase,
  Globe,
  BadgeCheck,
  ArrowRight,
  Trash2,
  UserPlus,
  Truck,
  Home,
  Plus,
  Minus,
  X,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    civilStatus: "",

    // Barangay & Official Information
    barangayName: "",
    barangayAddress: "",
    city: "",
    province: "",
    region: "",
    position: "",
    department: "",
    employeeId: "",
    officialEmail: "",
    officePhone: "",
    jurisdictionArea: "",

    // Garbage Truck Management
    garbageTrucks: [],

    // Account Information
    username: "",
    password: "",
    confirmPassword: "",

    // Verification Documents
    governmentId: null,
    appointmentOrder: null,
    officialId: null,
    barangayClearance: null,

    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToDataSharing: false,
  });

  // Cebu-specific locations
  const cebuCities = [
    "Cebu City",
    "Mandaue City",
    "Lapu-Lapu City",
    "Talisay City",
    "Naga City",
    "Carcar City",
    "Toledo City",
    "Danao City",
    "Bogo City",
  ];

  const cebuBarangays = [
    "Lahug",
    "Apas",
    "Camputhaw",
    "Capitol Site",
    "Cogon Ramos",
    "Day-as",
    "Ermita",
    "Kalubihan",
    "Kalunasan",
    "Kamagayan",
    "Kasambagan",
    "Lorega San Miguel",
    "Luz",
    "Mabolo",
    "Pahina Central",
    "Pari-an",
    "Parian",
    "Sambag I",
    "Sambag II",
    "San Antonio",
    "San Jose",
    "San Roque",
    "Santa Cruz",
    "Santo Niño",
    "T. Padilla",
    "Tejero",
    "Tinago",
    "Zapatera",
  ];

  const regions = [
    "Region VII - Central Visayas",
    "NCR - National Capital Region",
    "Region I - Ilocos Region",
    "Region III - Central Luzon",
    "Region IV-A - CALABARZON",
  ];

  const positions = [
    "Barangay Captain",
    "Barangay Kagawad",
    "Barangay Secretary",
    "Barangay Treasurer",
    "Barangay Tanod Chief",
    "Waste Management Officer",
    "Environmental Officer",
    "Sanitary Inspector",
    "Health Officer",
    "City Councilor",
    "City Mayor",
    "Vice Mayor",
    "City Administrator",
  ];

  const departments = [
    "Barangay Council",
    "Waste Management Division",
    "City Environment and Natural Resources Office",
    "Barangay Health Office",
    "Sanitation Department",
    "Public Safety Office",
    "City Administrator's Office",
    "Environmental Compliance Office",
  ];

  const truckTypes = [
    "Compactor Truck",
    "Dump Truck",
    "Rear Loader",
    "Side Loader",
    "Roll-off Truck",
    "Open Bed Truck",
  ];

  const truckStatuses = ["Active", "Maintenance", "Inactive"];

  // Garbage Truck Management Functions
  const addGarbageTruck = () => {
    const newTruck = {
      id: Date.now(),
      truckNumber: "",
      plateNumber: "",
      truckType: "",
      capacity: "",
      assignedDriver: "",
      driverContact: "",
      status: "Active",
      assignedRoute: "",
      lastMaintenance: "",
      remarks: "",
    };
    setFormData({
      ...formData,
      garbageTrucks: [...formData.garbageTrucks, newTruck],
    });
  };

  const removeGarbageTruck = (truckId) => {
    setFormData({
      ...formData,
      garbageTrucks: formData.garbageTrucks.filter(
        (truck) => truck.id !== truckId,
      ),
    });
  };

  const updateGarbageTruck = (truckId, field, value) => {
    setFormData({
      ...formData,
      garbageTrucks: formData.garbageTrucks.map((truck) =>
        truck.id === truckId ? { ...truck, [field]: value } : truck,
      ),
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.barangayName.trim())
      newErrors.barangayName = "Barangay name is required";
    if (!formData.barangayAddress.trim())
      newErrors.barangayAddress = "Barangay address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province.trim()) newErrors.province = "Province is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.employeeId.trim())
      newErrors.employeeId = "Employee ID is required";
    if (!formData.officialEmail.trim())
      newErrors.officialEmail = "Official email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.officialEmail))
      newErrors.officialEmail = "Invalid email format";
    if (!formData.jurisdictionArea.trim())
      newErrors.jurisdictionArea = "Jurisdiction area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    // Validate garbage trucks
    if (formData.garbageTrucks.length === 0) {
      newErrors.garbageTrucks = "At least one garbage truck must be registered";
    } else {
      const truckErrors = [];
      formData.garbageTrucks.forEach((truck, index) => {
        const truckError = {};
        if (!truck.truckNumber.trim())
          truckError.truckNumber = "Truck number required";
        if (!truck.plateNumber.trim())
          truckError.plateNumber = "Plate number required";
        if (!truck.truckType) truckError.truckType = "Type required";
        if (!truck.capacity.trim()) truckError.capacity = "Capacity required";
        if (Object.keys(truckError).length > 0) {
          truckErrors[index] = truckError;
        }
      });
      if (truckErrors.length > 0) newErrors.truckDetails = truckErrors;
    }

    // Validate documents
    if (!formData.governmentId)
      newErrors.governmentId = "Government ID is required";
    if (!formData.appointmentOrder)
      newErrors.appointmentOrder = "Appointment order is required";
    if (!formData.barangayClearance)
      newErrors.barangayClearance = "Barangay clearance is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 4)
      newErrors.username = "Username must be at least 4 characters";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors = {};

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";
    if (!formData.agreeToPrivacy)
      newErrors.agreeToPrivacy = "You must agree to the privacy policy";
    if (!formData.agreeToDataSharing)
      newErrors.agreeToDataSharing =
        "You must agree to data sharing for waste monitoring";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      case 5:
        isValid = validateStep5();
        break;
    }

    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep5()) return;
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration data:", formData);
      setSuccess(true);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">G-TRASH</h1>
            <p className="text-white/90 text-sm">
              Smart Waste Monitoring System
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Registration Submitted Successfully!
            </h2>
            <p className="text-neutral-600 mb-4">
              Your official account registration for Barangay{" "}
              {formData.barangayName} has been submitted. Our verification team
              will review your documents and activate your account within 2-3
              business days.
            </p>

            {/* Registration Summary */}
            <div className="bg-neutral-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Application ID:</span>
                <span className="font-semibold text-green-700">
                  GTR-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Barangay:</span>
                <span className="font-medium">{formData.barangayName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Position:</span>
                <span className="font-medium">{formData.position}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Trucks Registered:</span>
                <span className="font-medium">
                  {formData.garbageTrucks.length} unit(s)
                </span>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Next Steps:</strong> Once approved, you'll have access
                to the G-TRASH dashboard where you can monitor waste levels,
                track garbage trucks, and view real-time pollution data for your
                barangay.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 py-12 px-4">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
              <Trash2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">G-TRASH</h1>
          <p className="text-white/90 text-sm">
            Smart Waste Monitoring System - Official Registration
          </p>
          <p className="text-white/70 text-xs mt-1">
            Register your barangay for IoT-enabled waste management
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-1">
            {[
              { num: 1, label: "Personal" },
              { num: 2, label: "Barangay" },
              { num: 3, label: "Trucks" },
              { num: 4, label: "Account" },
              { num: 5, label: "Review" },
            ].map((s) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                      step >= s.num
                        ? "bg-white text-green-600 shadow-lg"
                        : "bg-white/20 text-white/60 border-2 border-white/30"
                    }`}
                  >
                    {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium hidden md:block ${
                      step >= s.num ? "text-white" : "text-white/60"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {s.num < 5 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-all ${
                      step > s.num ? "bg-white" : "bg-white/30"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Personal Information
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Please provide your personal details as the registering
                      official
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                      placeholder="Enter middle name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Suffix
                    </label>
                    <select
                      name="suffix"
                      value={formData.suffix}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    >
                      <option value="">None</option>
                      <option value="Jr.">Jr.</option>
                      <option value="Sr.">Sr.</option>
                      <option value="III">III</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.email ? "border-red-500" : "border-neutral-300"
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.phone ? "border-red-500" : "border-neutral-300"
                        }`}
                        placeholder="+63 XXX XXX XXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Birth Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.birthDate
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.birthDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.gender ? "border-red-500" : "border-neutral-300"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Civil Status
                    </label>
                    <select
                      name="civilStatus"
                      value={formData.civilStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Barangay & Official Information */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Barangay & Official Information
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Provide your barangay and government office details
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-800">
                      <strong>Important:</strong> This registration is for
                      barangay-level waste management. You will be able to
                      monitor pollution levels, track garbage trucks, and view
                      heatmaps for your jurisdiction area.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Barangay Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="barangayName"
                      value={formData.barangayName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.barangayName
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                    >
                      <option value="">Select your barangay</option>
                      {cebuBarangays.map((brgy) => (
                        <option key={brgy} value={brgy}>
                          {brgy}
                        </option>
                      ))}
                    </select>
                    {errors.barangayName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.barangayName}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Barangay Hall Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                      <textarea
                        name="barangayAddress"
                        value={formData.barangayAddress}
                        onChange={handleInputChange}
                        rows="2"
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.barangayAddress
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="Enter complete barangay hall address"
                      />
                    </div>
                    {errors.barangayAddress && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.barangayAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.city ? "border-red-500" : "border-neutral-300"
                      }`}
                    >
                      <option value="">Select city</option>
                      {cebuCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.province
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                      placeholder="e.g., Cebu"
                    />
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.province}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Region
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                      >
                        <option value="">Select region</option>
                        {regions.map((reg) => (
                          <option key={reg} value={reg}>
                            {reg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Jurisdiction Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jurisdictionArea"
                      value={formData.jurisdictionArea}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.jurisdictionArea
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                      placeholder="e.g., Sitio A, Purok 1-5"
                    />
                    {errors.jurisdictionArea && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.jurisdictionArea}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Your Position <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.position
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                      >
                        <option value="">Select position</option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.position && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.position}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Department/Office <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                        errors.department
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.employeeId
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="Enter employee ID"
                      />
                    </div>
                    {errors.employeeId && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.employeeId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Official Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        name="officialEmail"
                        value={formData.officialEmail}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.officialEmail
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="official@barangay.gov.ph"
                      />
                    </div>
                    {errors.officialEmail && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.officialEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Office Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        name="officePhone"
                        value={formData.officePhone}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                        placeholder="Barangay hall contact number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Garbage Truck Management */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">
                        Garbage Truck Management
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Register your barangay's garbage trucks for tracking
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addGarbageTruck}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Truck
                  </button>
                </div>

                {errors.garbageTrucks && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.garbageTrucks}
                    </p>
                  </div>
                )}

                {formData.garbageTrucks.length === 0 && (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
                    <Truck className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-500 text-sm">
                      No garbage trucks registered yet
                    </p>
                    <p className="text-neutral-400 text-xs mt-1">
                      Click "Add Truck" to register your barangay's garbage
                      trucks for IoT tracking
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {formData.garbageTrucks.map((truck, index) => (
                    <div
                      key={truck.id}
                      className="border border-neutral-200 rounded-lg p-4 bg-neutral-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-sm text-neutral-800 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-green-600" />
                          Truck #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeGarbageTruck(truck.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Truck Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={truck.truckNumber}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "truckNumber",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="e.g., BGY-LAHUG-001"
                          />
                          {errors.truckDetails?.[index]?.truckNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.truckDetails[index].truckNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Plate Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={truck.plateNumber}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "plateNumber",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="e.g., ABC 1234"
                          />
                          {errors.truckDetails?.[index]?.plateNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.truckDetails[index].plateNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Truck Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={truck.truckType}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "truckType",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          >
                            <option value="">Select type</option>
                            {truckTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {errors.truckDetails?.[index]?.truckType && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.truckDetails[index].truckType}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Capacity (tons){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={truck.capacity}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "capacity",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="e.g., 5 tons"
                          />
                          {errors.truckDetails?.[index]?.capacity && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.truckDetails[index].capacity}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Assigned Driver
                          </label>
                          <input
                            type="text"
                            value={truck.assignedDriver}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "assignedDriver",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="Driver's full name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Driver Contact
                          </label>
                          <input
                            type="tel"
                            value={truck.driverContact}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "driverContact",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="Driver's phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Status
                          </label>
                          <select
                            value={truck.status}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "status",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          >
                            {truckStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Assigned Route
                          </label>
                          <input
                            type="text"
                            value={truck.assignedRoute}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "assignedRoute",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="e.g., Ayala → SM → Lahug"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Last Maintenance
                          </label>
                          <input
                            type="date"
                            value={truck.lastMaintenance}
                            onChange={(e) =>
                              updateGarbageTruck(
                                truck.id,
                                "lastMaintenance",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Remarks
                        </label>
                        <input
                          type="text"
                          value={truck.remarks}
                          onChange={(e) =>
                            updateGarbageTruck(
                              truck.id,
                              "remarks",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          placeholder="Additional notes about this truck"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Uploads */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Required Verification Documents
                  </h3>

                  <div className="space-y-3">
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                        formData.governmentId
                          ? "border-green-300 bg-green-50"
                          : "border-neutral-300 hover:border-green-400"
                      }`}
                    >
                      <input
                        type="file"
                        name="governmentId"
                        onChange={handleInputChange}
                        className="hidden"
                        id="governmentId"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="governmentId" className="cursor-pointer">
                        <IdCard
                          className={`w-6 h-6 mx-auto mb-1 ${
                            formData.governmentId
                              ? "text-green-600"
                              : "text-neutral-400"
                          }`}
                        />
                        <p className="text-sm font-medium text-neutral-700">
                          Government-Issued ID{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formData.governmentId
                            ? formData.governmentId.name
                            : "Upload scanned copy (PDF, JPG, PNG)"}
                        </p>
                        {formData.governmentId && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1 justify-center">
                            <CheckCircle className="w-3 h-3" /> File uploaded
                          </p>
                        )}
                      </label>
                    </div>
                    {errors.governmentId && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.governmentId}
                      </p>
                    )}

                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                        formData.appointmentOrder
                          ? "border-green-300 bg-green-50"
                          : "border-neutral-300 hover:border-green-400"
                      }`}
                    >
                      <input
                        type="file"
                        name="appointmentOrder"
                        onChange={handleInputChange}
                        className="hidden"
                        id="appointmentOrder"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="appointmentOrder"
                        className="cursor-pointer"
                      >
                        <FileText
                          className={`w-6 h-6 mx-auto mb-1 ${
                            formData.appointmentOrder
                              ? "text-green-600"
                              : "text-neutral-400"
                          }`}
                        />
                        <p className="text-sm font-medium text-neutral-700">
                          Appointment/Designation Order{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formData.appointmentOrder
                            ? formData.appointmentOrder.name
                            : "Upload appointment document"}
                        </p>
                        {formData.appointmentOrder && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1 justify-center">
                            <CheckCircle className="w-3 h-3" /> File uploaded
                          </p>
                        )}
                      </label>
                    </div>
                    {errors.appointmentOrder && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.appointmentOrder}
                      </p>
                    )}

                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                        formData.barangayClearance
                          ? "border-green-300 bg-green-50"
                          : "border-neutral-300 hover:border-green-400"
                      }`}
                    >
                      <input
                        type="file"
                        name="barangayClearance"
                        onChange={handleInputChange}
                        className="hidden"
                        id="barangayClearance"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="barangayClearance"
                        className="cursor-pointer"
                      >
                        <Shield
                          className={`w-6 h-6 mx-auto mb-1 ${
                            formData.barangayClearance
                              ? "text-green-600"
                              : "text-neutral-400"
                          }`}
                        />
                        <p className="text-sm font-medium text-neutral-700">
                          Barangay Clearance{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formData.barangayClearance
                            ? formData.barangayClearance.name
                            : "Upload barangay clearance certificate"}
                        </p>
                        {formData.barangayClearance && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1 justify-center">
                            <CheckCircle className="w-3 h-3" /> File uploaded
                          </p>
                        )}
                      </label>
                    </div>
                    {errors.barangayClearance && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.barangayClearance}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Account Setup */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Account Setup
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Create your login credentials for G-TRASH dashboard access
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.username
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="Choose a username"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.password
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Review Your Application
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Verify all information before submitting to G-TRASH System
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Personal Info Summary */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" /> Personal
                      Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-neutral-500">Full Name</p>
                        <p className="font-medium text-neutral-900">
                          {formData.firstName} {formData.middleName}{" "}
                          {formData.lastName} {formData.suffix}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Email</p>
                        <p className="font-medium text-neutral-900">
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Phone</p>
                        <p className="font-medium text-neutral-900">
                          {formData.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Birth Date</p>
                        <p className="font-medium text-neutral-900">
                          {formData.birthDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Barangay Info Summary */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4 text-green-600" /> Barangay
                      Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-neutral-500">Barangay</p>
                        <p className="font-medium text-neutral-900">
                          {formData.barangayName}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">City</p>
                        <p className="font-medium text-neutral-900">
                          {formData.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Position</p>
                        <p className="font-medium text-neutral-900">
                          {formData.position}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Department</p>
                        <p className="font-medium text-neutral-900">
                          {formData.department}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-neutral-500">Jurisdiction</p>
                        <p className="font-medium text-neutral-900">
                          {formData.jurisdictionArea}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trucks Summary */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" /> Garbage
                      Trucks ({formData.garbageTrucks.length})
                    </h3>
                    {formData.garbageTrucks.length > 0 ? (
                      <div className="space-y-2">
                        {formData.garbageTrucks.map((truck, idx) => (
                          <div
                            key={truck.id}
                            className="text-xs bg-white rounded p-2"
                          >
                            <p className="font-medium">
                              Truck #{idx + 1}: {truck.truckNumber || "N/A"}
                            </p>
                            <p className="text-neutral-500">
                              Plate: {truck.plateNumber || "N/A"} | Type:{" "}
                              {truck.truckType || "N/A"} | Capacity:{" "}
                              {truck.capacity || "N/A"} tons
                            </p>
                            <p className="text-neutral-500">
                              Status: {truck.status} | Route:{" "}
                              {truck.assignedRoute || "Not assigned"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-red-500">
                        No trucks registered
                      </p>
                    )}
                  </div>

                  {/* Documents Summary */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" /> Documents
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>
                          Government ID:{" "}
                          {formData.governmentId?.name || "Not uploaded"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>
                          Appointment Order:{" "}
                          {formData.appointmentOrder?.name || "Not uploaded"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>
                          Barangay Clearance:{" "}
                          {formData.barangayClearance?.name || "Not uploaded"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-xs text-neutral-600">
                      I agree to the G-TRASH{" "}
                      <button
                        type="button"
                        className="text-green-600 hover:underline font-medium"
                      >
                        Terms of Service
                      </button>{" "}
                      for Government Officials
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs ml-6 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.agreeToTerms}
                    </p>
                  )}

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-xs text-neutral-600">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-green-600 hover:underline font-medium"
                      >
                        Privacy Policy
                      </button>{" "}
                      and consent to personal data processing
                    </span>
                  </label>
                  {errors.agreeToPrivacy && (
                    <p className="text-red-500 text-xs ml-6 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.agreeToPrivacy}
                    </p>
                  )}

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToDataSharing"
                      checked={formData.agreeToDataSharing}
                      onChange={handleInputChange}
                      className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-xs text-neutral-600">
                      I agree to share waste management data for G-TRASH IoT
                      monitoring, including garbage truck GPS tracking and
                      pollution sensor data from my barangay jurisdiction
                    </span>
                  </label>
                  {errors.agreeToDataSharing && (
                    <p className="text-red-500 text-xs ml-6 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.agreeToDataSharing}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-800">
                    <strong>Note:</strong> By submitting this application, you
                    certify that all information is true and accurate. Your
                    barangay will be enrolled in the G-TRASH Smart Waste
                    Monitoring System, enabling IoT-based pollution monitoring,
                    garbage truck GPS tracking, and real-time heatmap
                    visualization for your jurisdiction.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-neutral-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Submit Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-white/70 text-sm mt-6">
          Already have an official G-TRASH account?{" "}
          <a href="/login" className="text-white hover:underline font-semibold">
            Sign in here
          </a>
        </p>

        <p className="text-center text-white/50 text-xs mt-4">
          © 2026 G-TRASH Smart Waste Monitoring System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
