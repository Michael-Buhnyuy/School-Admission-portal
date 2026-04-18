import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, User, Calendar, Eye } from "lucide-react";

interface Review {
  id: number;
  admin_id: number;
  admin_name: string;
  action: string;
  description: string;
  entity_type: string;
  entity_id: number;
  status?: string;
  notes?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: number;
}

const Reviews: React.FC = () => {
  const { admin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    fetchReviews();
  }, [admin]);

  const fetchReviews = async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/reviews/pending`, {
        headers: {
          "X-Admin-ID": admin.id.toString(),
        },
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDecision = async (reviewId: number, decision: "approved" | "rejected") => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE}/admin/review/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-ID": admin?.id.toString() || "",
        },
        body: JSON.stringify({
          decision,
          note: note.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNote("");
        setSelectedReview(null);
        fetchReviews();
      } else {
        alert(data.message || "Failed to process review");
      }
    } catch (error) {
      console.error("Review decision error:", error);
      alert("Network error");
    } finally {
      setProcessing(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "pending") return !review.status || review.status === "pending";
    return review.status === filter;
  });

  const getStatusBadge = (review: Review) => {
    if (review.status === "approved") {
      return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Approved</span>;
    }
    if (review.status === "rejected") {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>;
    }
    return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending Review</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reviews Panel</h1>
          <p className="text-slate-500 mt-1">Review and approve changes submitted by admins</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Pending Reviews</p>
          <p className="text-2xl font-bold text-amber-600">
            {reviews.filter(r => !r.status || r.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Approved</p>
          <p className="text-2xl font-bold text-emerald-600">
            {reviews.filter(r => r.status === "approved").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {reviews.filter(r => r.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex gap-3">
        {(["pending", "all", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-[#1d4746] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{review.admin_name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{review.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          {review.entity_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(review)}
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Review Changes</h2>
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setNote("");
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Submitted by</p>
                <p className="font-medium text-slate-800">{selectedReview.admin_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Description</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">{selectedReview.description}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Submitted on</p>
                <p className="text-slate-800">{new Date(selectedReview.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Your Decision</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setDecision("approved");
                      handleReviewDecision(selectedReview.id, "approved");
                    }}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setDecision("rejected");
                      handleReviewDecision(selectedReview.id, "rejected");
                    }}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Add a note (optional)</p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add feedback or comments..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746] resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
