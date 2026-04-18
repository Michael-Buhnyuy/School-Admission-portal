import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { applicants as mockApplicants, getDashboardStats as getMockStats } from "../data/mockData";

// API Base URL - using PHP API backend
const API_BASE = "http://localhost:8080/api";

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_verified: number;
  is_active: number;
  created_at: string;
}

interface Application {
  id: number;
  applicant_id: number;
  application_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  nationality: string;
  primary_school: string;
  primary_year: string;
  secondary_school: string;
  secondary_year: string;
  tertiary_institution: string;
  tertiary_course: string;
  selected_program: string;
  campus: string;
  intake: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

interface Admin {
  id: number;
  admin_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_label: string;
  department: string;
  token: string;
}

interface AuthContextType {
  // Admin auth
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;

  // Applicant auth
  applicant: Applicant | null;
  applicantToken: string | null;
  applicantLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  applicantLogout: () => void;

  // Applications
  applications: Application[];
  fetchApplications: () => Promise<void>;
  updateApplicationStatus: (
    id: number,
    status: string,
    notes?: string,
  ) => Promise<{ success: boolean; message: string }>;

  // Stats
  stats: {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
  };
  fetchStats: () => Promise<void>;

  // Loading states
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [applicantToken, setApplicantToken] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
  });

  // Load admin from localStorage on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }

    const savedApplicant = localStorage.getItem("applicant");
    const savedToken = localStorage.getItem("applicant_token");
    if (savedApplicant && savedToken) {
      setApplicant(JSON.parse(savedApplicant));
      setApplicantToken(savedToken);
    }
  }, []);

  // Admin Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.data);
        localStorage.setItem("admin", JSON.stringify(data.data));
        return { success: true, message: "Login successful" };
      } else {
        // Fallback to mock authentication
        if (email === "john.smith@admission.edu" && password === "admin123") {
          const mockAdmin: Admin = {
            id: 1,
            admin_id: "SUP001",
            email: "john.smith@admission.edu",
            first_name: "John",
            last_name: "Smith",
            role: "super_admin",
            role_label: "Super Admin",
            department: "Administration",
            token: "mock-token-12345",
          };
          setAdmin(mockAdmin);
          localStorage.setItem("admin", JSON.stringify(mockAdmin));
          return { success: true, message: "Login successful (Demo Mode)" };
        }
        if (email === "sarah.johnson@admission.edu" && password === "admin123") {
          const mockAdmin: Admin = {
            id: 2,
            admin_id: "OFF001",
            email: "sarah.johnson@admission.edu",
            first_name: "Sarah",
            last_name: "Johnson",
            role: "admission_officer",
            role_label: "Admission Officer",
            department: "Admissions",
            token: "mock-token-67890",
          };
          setAdmin(mockAdmin);
          localStorage.setItem("admin", JSON.stringify(mockAdmin));
          return { success: true, message: "Login successful (Demo Mode)" };
        }
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      // Fallback to mock authentication when API is unavailable
      if (email === "john.smith@admission.edu" && password === "admin123") {
        const mockAdmin: Admin = {
          id: 1,
          admin_id: "SUP001",
          email: "john.smith@admission.edu",
          first_name: "John",
          last_name: "Smith",
          role: "super_admin",
          role_label: "Super Admin",
          department: "Administration",
          token: "mock-token-12345",
        };
        setAdmin(mockAdmin);
        localStorage.setItem("admin", JSON.stringify(mockAdmin));
        return { success: true, message: "Login successful (Demo Mode)" };
      }
      if (email === "sarah.johnson@admission.edu" && password === "admin123") {
        const mockAdmin: Admin = {
          id: 2,
          admin_id: "OFF001",
          email: "sarah.johnson@admission.edu",
          first_name: "Sarah",
          last_name: "Johnson",
          role: "admission_officer",
          role_label: "Admission Officer",
          department: "Admissions",
          token: "mock-token-67890",
        };
        setAdmin(mockAdmin);
        localStorage.setItem("admin", JSON.stringify(mockAdmin));
        return { success: true, message: "Login successful (Demo Mode)" };
      }
      return {
        success: false,
        message: "Network error. Please check if the backend is running.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Logout
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  // Applicant Login
  const applicantLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/applicant/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setApplicant(data.data.applicant);
        setApplicantToken(data.data.token);
        localStorage.setItem("applicant", JSON.stringify(data.data.applicant));
        localStorage.setItem("applicant_token", data.data.token);
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Applicant login error:", error);
      return {
        success: false,
        message: "Network error. Please check if the backend is running.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Applicant Logout
  const applicantLogout = () => {
    setApplicant(null);
    setApplicantToken(null);
    localStorage.removeItem("applicant");
    localStorage.removeItem("applicant_token");
  };

  // Fetch Applications
  const fetchApplications = async () => {
    if (!admin) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/applicants`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error("Fetch applications error:", error);
      // Fallback to mock data
      const mockApps: Application[] = mockApplicants.map((app, index) => ({
        id: index + 1,
        applicant_id: index + 1,
        application_number: `APP${String(index + 1).padStart(4, "0")}`,
        first_name: app.firstName,
        last_name: app.lastName,
        date_of_birth: app.dateOfBirth || "2005-01-01",
        gender: "not_specified",
        email: app.email,
        phone: app.phone,
        address: app.address || "123 Main St",
        city: "Boston",
        state: "MA",
        nationality: "USA",
        primary_school: "Primary School",
        primary_year: "2011",
        secondary_school: app.previousSchool || "High School",
        secondary_year: "2023",
        tertiary_institution: "",
        tertiary_course: "",
        selected_program: app.program || "Computer Science",
        campus: "Main Campus",
        intake: "Fall 2024",
        status: (app.status as "pending" | "under_review" | "approved" | "rejected") || "pending",
        admin_notes: null,
        reviewed_by: null,
        reviewed_at: null,
        created_at: app.appliedDate || "2024-01-15",
      }));
      setApplications(mockApps);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Application Status
  const updateApplicationStatus = async (
    id: number,
    status: string,
    notes?: string,
  ) => {
    if (!admin) {
      return { success: false, message: "Not authenticated" };
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/applicant/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({
          status,
          admin_notes: notes,
          admin_id: admin.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh applications
        fetchApplications();
        return { success: true, message: "Status updated successfully" };
      } else {
        return { success: false, message: data.message || "Update failed" };
      }
    } catch (error) {
      console.error("Update status error:", error);
      return { success: false, message: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    if (!admin) return;

    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data.applications);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
      // Fallback to mock stats
      const mockStats = getMockStats();
      setStats({
        total: mockStats.totalApplications,
        pending: mockStats.pendingApplications,
        under_review: mockStats.reviewedApplications,
        approved: mockStats.approvedApplications,
        rejected: mockStats.rejectedApplications,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        login,
        logout,
        applicant,
        applicantToken,
        applicantLogin,
        applicantLogout,
        applications,
        fetchApplications,
        updateApplicationStatus,
        stats,
        fetchStats,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
