import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  X,
} from "lucide-react";

interface Document {
  id: number;
  applicant_id: number;
  application_id: number | null;
  filename: string;
  original_name: string;
  file_path: string;
  type: "passport_photo" | "transcript" | "certificate" | "identification" | "other";
  mime_type: string;
  size_bytes: number;
  status: "pending" | "verified" | "flagged" | "rejected";
  reviewed_by: number | null;
  notes: string | null;
  uploaded_at: string;
}

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const Documents: React.FC = () => {
  const { admin, fetchApplications, applications } = useAuth();
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const itemsPerPage = 8;

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchAllDocuments();
  }, [admin]);

  const fetchAllDocuments = async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/documents/stats`, {
        headers: {
          "X-Admin-ID": admin.id.toString(),
        },
      });
      const statsData = await response.json();
      
      if (statsData.success) {
        setAllDocuments([]); 
      }
      
      const applicationsResponse = await fetch(`${API_BASE}/admin/applicants`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const appsData = await applicationsResponse.json();
      if (appsData.success) {
        const uniqueApplicants: Applicant[] = [];
        const seen = new Set();
        appsData.data.forEach((app: any) => {
          if (!seen.has(app.applicant_id)) {
            seen.add(app.applicant_id);
            uniqueApplicants.push({
              id: app.applicant_id,
              first_name: app.first_name,
              last_name: app.last_name,
              email: app.email,
            });
          }
        });
        setApplicants(uniqueApplicants);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentsForApplicant = async (applicantId: number) => {
    try {
      const response = await fetch(`${API_BASE}/documents/applicant/${applicantId}`, {
        headers: {
          "X-Admin-ID": admin?.id.toString() || "",
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error(`Error fetching documents for applicant ${applicantId}:`, error);
    }
    return [];
  };

  const documents = useMemo(() => {
    const docs: Document[] = [];
    
    applications.forEach((app: any) => {
      if (app.documents && Array.isArray(app.documents)) {
        app.documents.forEach((doc: any) => {
          docs.push({
            id: doc.id,
            applicant_id: app.applicant_id || app.id,
            application_id: app.id,
            filename: doc.filename,
            original_name: doc.original_name,
            file_path: doc.file_path,
            type: doc.type,
            mime_type: doc.mime_type || "application/pdf",
            size_bytes: doc.size_bytes || 0,
            status: doc.status,
            reviewed_by: doc.reviewed_by || null,
            notes: doc.notes || null,
            uploaded_at: doc.uploaded_at || doc.created_at || new Date().toISOString(),
          });
        });
      }
    });
    
    return docs;
  }, [applications]);

  const enrichedDocuments = useMemo(() => {
    return documents.map((doc) => {
      const applicant = applicants.find((a) => a.id === doc.applicant_id);
      return {
        ...doc,
        applicantName: applicant
          ? `${applicant.first_name} ${applicant.last_name}`
          : "Unknown Applicant",
        applicantEmail: applicant?.email || "",
      };
    });
  }, [documents, applicants]);

  const filteredDocuments = useMemo(() => {
    return enrichedDocuments.filter((doc) => {
      const matchesSearch =
        doc.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.original_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      const matchesType = typeFilter === "all" || doc.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [enrichedDocuments, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
      flagged: "bg-red-100 text-red-700 border-red-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const icons: Record<string, React.ReactNode> = {
      verified: <CheckCircle className="w-3.5 h-3.5" />,
      flagged: <XCircle className="w-3.5 h-3.5" />,
      rejected: <XCircle className="w-3.5 h-3.5" />,
      pending: <Clock className="w-3.5 h-3.5" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-100 text-slate-700"}`}>
        {icons[status] || <Clock className="w-3.5 h-3.5" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusUpdate = async (docId: number, status: string) => {
    try {
      const response = await fetch(`${API_BASE}/documents/${docId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-ID": admin?.id.toString() || "",
        },
        body: JSON.stringify({ status, notes: "" }),
      });
      const data = await response.json();
      if (data.success) {
        fetchAllDocuments();
      }
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Verification</h1>
          <p className="text-slate-500 mt-1">Review and verify applicant documents</p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Total Documents</p>
          <p className="text-xl font-bold text-slate-800">{filteredDocuments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Verified", count: documents.filter((d) => d.status === "verified").length, color: "bg-emerald-50 text-emerald-700" },
          { label: "Pending", count: documents.filter((d) => d.status === "pending").length, color: "bg-slate-50 text-slate-700" },
          { label: "Flagged", count: documents.filter((d) => d.status === "flagged").length, color: "bg-red-50 text-red-700" },
          { label: "Rejected", count: documents.filter((d) => d.status === "rejected").length, color: "bg-amber-50 text-amber-700" },
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by applicant name, email, or document..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746]"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746]"
            >
              <option value="all">All Types</option>
              <option value="transcript">Transcript</option>
              <option value="certificate">Certificate</option>
              <option value="identification">ID</option>
              <option value="passport_photo">Passport Photo</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Document</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Applicant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{doc.original_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{doc.applicantName}</p>
                        <p className="text-sm text-slate-500">{doc.applicantEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 capitalize">{doc.type.replace("_", " ")}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`http://localhost:8080/${doc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        {doc.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(doc.id, "verified")}
                              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600"
                              title="Verify"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(doc.id, "flagged")}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                              title="Flag"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {doc.status === "flagged" && (
                          <button
                            onClick={() => handleStatusUpdate(doc.id, "rejected")}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {loading ? "Loading documents..." : "No documents found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of {filteredDocuments.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg ${currentPage === page ? "bg-[#1d4746] text-white" : "border border-slate-200 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">{viewingDoc.original_name}</h3>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {viewingDoc.mime_type.includes("image") ? (
                <img
                  src={`http://localhost:8080/${viewingDoc.file_path}`}
                  alt={viewingDoc.original_name}
                  className="max-w-full h-auto mx-auto"
                />
              ) : viewingDoc.mime_type.includes("pdf") ? (
                <iframe
                  src={`http://localhost:8080/${viewingDoc.file_path}`}
                  className="w-full h-[60vh] border-0"
                  title={viewingDoc.original_name}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">Preview not available</p>
                  <a
                    href={`http://localhost:8080/${viewingDoc.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#1d4746] text-white rounded-lg hover:bg-[#1d4746]/90"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
