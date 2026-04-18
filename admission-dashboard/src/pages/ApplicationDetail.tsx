import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  GraduationCap,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Shield,
  Upload,
  Eye,
  Download,
  Send,
  Plus,
  MessageSquare,
} from "lucide-react";

interface Document {
  id: number;
  application_id: number | null;
  applicant_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  type: string;
  mime_type: string;
  size_bytes: number;
  status: "pending" | "verified" | "flagged" | "rejected";
  reviewed_by: number | null;
  notes: string | null;
  uploaded_at: string;
}

type Tab = "details" | "documents" | "messages";

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, fetchApplications, updateApplicationStatus, admin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>("other");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState<"approve" | "reject" | null>(null);

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (activeTab === "documents" && id) {
      fetchDocuments();
    }
  }, [activeTab, id]);

  const applicant = useMemo(
    () => applications.find((a) => a.id.toString() === id || a.applicant_id.toString() === id),
    [applications, id],
  );

  const fetchDocuments = async () => {
    if (!applicant || !admin) return;
    setLoadingDocuments(true);
    try {
      const response = await fetch(`${API_BASE}/documents/applicant/${applicant.applicant_id || applicant.id}`, {
        headers: {
          "X-Admin-ID": admin.id.toString(),
        },
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !admin || !applicant) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("applicant_id", (applicant.applicant_id || applicant.id).toString());
    formData.append("application_id", applicant.id.toString());
    formData.append("type", docType);

    try {
      const response = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        headers: {
          "X-Admin-ID": admin.id.toString(),
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSelectedFile(null);
        fetchDocuments();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Network error. Ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!admin || !id) return;
    const notes = showNoteInput === "approve" && status === "approved" ? actionNote : 
                 showNoteInput === "reject" && status === "rejected" ? actionNote : "";
    
    const result = await updateApplicationStatus(parseInt(id), status, notes);
    if (result.success) {
      fetchApplications();
      setShowNoteInput(null);
      setActionNote("");
    } else {
      alert(result.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !admin || !applicant) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-ID": admin.id.toString(),
        },
        body: JSON.stringify({
          sender_type: "admin",
          sender_id: admin.id,
          recipient_type: "applicant",
          recipient_id: applicant.applicant_id || applicant.id,
          subject: subject || "Application Update",
          content: message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("");
        setSubject("");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      alert("Network error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusUpdateDocument = async (docId: number, status: string) => {
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
        fetchDocuments();
      }
    } catch (error) {
      console.error("Update document status error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      under_review: "bg-blue-100 text-blue-700 border-blue-200",
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-4 h-4" />,
      under_review: <FileText className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${styles[status] || "bg-slate-100 text-slate-700"}`}>
        {icons[status] || <Clock className="w-4 h-4" />}
        {status?.replace("_", " ").charAt(0).toUpperCase() + status?.replace("_", " ").slice(1)}
      </span>
    );
  };

  const canMakeDecision = applicant && (applicant.status === "pending" || applicant.status === "under_review");

  if (!applicant) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Application Not Found</h2>
        <p className="text-slate-500 mt-2">The requested application could not be found.</p>
        <button
          onClick={() => navigate("/applications")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/applications")}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Application Details</h1>
            <p className="text-slate-500">Application #{applicant.application_number || id}</p>
          </div>
        </div>
        {getStatusBadge(applicant.status)}
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "details" 
                ? "bg-[#1d4746] text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Details
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "documents" 
                ? "bg-[#1d4746] text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "messages" 
                ? "bg-[#1d4746] text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Messages
          </button>
        </div>

        <div className="ml-auto flex gap-2">
          {canMakeDecision && (
            <>
              {showNoteInput ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Add note (optional)"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleStatusUpdate(showNoteInput === "approve" ? "approved" : "rejected")}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => { setShowNoteInput(null); setActionNote(""); }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setShowNoteInput("approve"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => { setShowNoteInput("reject"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#1d4746]" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Full Name</p>
                  <p className="font-medium text-slate-800">
                    {applicant.first_name} {applicant.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email Address</p>
                  <p className="font-medium text-slate-800">{applicant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                  <p className="font-medium text-slate-800">{applicant.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date of Birth</p>
                  <p className="font-medium text-slate-800">
                    {applicant.date_of_birth || "Not provided"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500 mb-1">Address</p>
                  <p className="font-medium text-slate-800">
                    {applicant.address}, {applicant.city}, {applicant.state}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1d4746]" />
                Education Background
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Primary School</p>
                  <p className="font-medium text-slate-800">
                    {applicant.primary_school || "Not provided"} ({applicant.primary_year || "N/A"})
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Secondary School</p>
                  <p className="font-medium text-slate-800">
                    {applicant.secondary_school || "Not provided"} ({applicant.secondary_year || "N/A"})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1d4746]" />
                Program Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Selected Program</p>
                  <p className="font-medium text-slate-800">
                    {applicant.selected_program || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Campus</p>
                  <p className="font-medium text-slate-800">
                    {applicant.campus || "Main Campus"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Intake</p>
                  <p className="font-medium text-slate-800">
                    {applicant.intake || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Application Date</p>
                  <p className="font-medium text-slate-800">
                    {applicant.created_at
                      ? new Date(applicant.created_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {applicant.admin_notes && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1d4746]" />
                  Admin Notes
                </h2>
                <p className="text-slate-600">{applicant.admin_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#1d4746]" />
              Upload Document
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746]"
                >
                  <option value="passport_photo">Passport Photo</option>
                  <option value="transcript">Transcript</option>
                  <option value="certificate">Certificate</option>
                  <option value="identification">Identification</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select File</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746] file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                />
              </div>
            </div>
            {selectedFile && (
              <div className="mt-4 flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <FileText className="w-8 h-8 text-slate-600" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-slate-200 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            )}
            <button
              onClick={handleUploadDocument}
              disabled={!selectedFile || uploading}
              className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-[#1d4746] text-white rounded-xl hover:bg-[#1d4746]/90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Document
                </>
              )}
            </button>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Uploaded Documents</h3>
            </div>
            {loadingDocuments ? (
              <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No documents uploaded</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-800">{doc.original_name}</p>
                        <p className="text-sm text-slate-500">
                          {doc.type.replace("_", " ")} • {(doc.size_bytes / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        doc.status === "verified" ? "bg-emerald-100 text-emerald-700" :
                        doc.status === "pending" ? "bg-slate-100 text-slate-700" :
                        doc.status === "flagged" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`http://localhost:8080/${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      {doc.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdateDocument(doc.id, "verified")}
                            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdateDocument(doc.id, "flagged")}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Send Message to Applicant</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746] resize-none"
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sendingMessage || !message.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1d4746] text-white rounded-xl hover:bg-[#1d4746]/90 disabled:opacity-50"
              >
                {sendingMessage ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

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
                <XCircle className="w-5 h-5" />
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

export default ApplicationDetail;
