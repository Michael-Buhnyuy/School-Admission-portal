import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Upload, FileText, X, CheckCircle, XCircle, AlertTriangle, Eye, Download } from "lucide-react";

interface Document {
  id: number;
  application_id: number | null;
  applicant_id: number;
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

interface DocumentUploaderProps {
  applicationId: number;
  applicantId: number;
  onUploadComplete: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ applicationId, applicantId, onUploadComplete }) => {
  const { admin } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>("other");
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const API_BASE = "http://localhost:8080/api";

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
      flagged: "bg-red-100 text-red-700 border-red-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return styles[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !admin) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("applicant_id", applicantId.toString());
    formData.append("application_id", applicationId.toString());
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
        setPreviewUrl("");
        onUploadComplete();
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Network error. Ensure backend is running on port 8080.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#1d4746]" />
          Upload Document
        </h3>

        <div className="space-y-4">
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

          {previewUrl && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <FileText className="w-8 h-8 text-slate-600" />
              <div className="flex-1">
                <p className="font-medium text-slate-800">{selectedFile?.name}</p>
                <p className="text-sm text-slate-500">{(selectedFile?.size || 0 / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl("");
                }}
                className="p-2 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1d4746] text-white rounded-xl hover:bg-[#1d4746]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document List */}
      <DocumentsList applicationId={applicationId} onRefresh={onUploadComplete} />
    </div>
  );
};

const DocumentsList: React.FC<{ applicationId: number; onRefresh: () => void }> = ({ applicationId, onRefresh }) => {
  const { admin } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);

  const API_BASE = "http://localhost:8080/api";

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/documents/application/${applicationId}`, {
        headers: {
          "X-Admin-ID": admin?.id.toString() || "",
        },
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

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
        fetchDocuments();
        onRefresh();
      }
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading documents...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Uploaded Documents</h3>
      </div>

      {documents.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>No documents uploaded yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{doc.original_name}</p>
                    <p className="text-sm text-slate-500">
                      {doc.type.replace("_", " ")} • {(doc.size_bytes / 1024).toFixed(2)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(doc.status)}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>

                  <div className="flex gap-2">
                    {doc.mime_type.includes("image") || doc.mime_type.includes("pdf") ? (
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <a
                        href={`http://localhost:8080/${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

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
                </div>
              </div>

              {doc.notes && (
                <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">Note: {doc.notes}</p>
              )}
            </div>
          ))}
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

export default DocumentUploader;
