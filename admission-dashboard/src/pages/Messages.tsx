import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Inbox, Send, User, MessageSquare, ChevronLeft, ChevronRight, Plus, Phone, Mail, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  thread_id: string;
  sender_type: "applicant" | "admin";
  sender_id: number;
  recipient_type: "applicant" | "admin";
  recipient_id: number;
  subject: string;
  content: string;
  attachment_path: string | null;
  is_read: number;
  status: "sent" | "delivered" | "read" | "failed";
  created_at: string;
}

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  application_number?: string;
}

interface ThreadOverview {
  thread_id: string;
  subject: string;
  content: string;
  created_at: string;
  sender_type: string;
  sender_id: number;
  is_read: number;
}

const Messages: React.FC = () => {
  const { admin, applications, fetchApplications } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "sent">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: "", content: "", recipient_id: "" });
  const [threads, setThreads] = useState<ThreadOverview[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (admin) {
      fetchThreads();
    }
  }, [admin]);

  const fetchThreads = async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/messages/threads?recipient_type=admin&recipient_id=${admin.id}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setThreads(data.data);
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreadMessages = async (threadId: string) => {
    try {
      const response = await fetch(`${API_BASE}/messages/thread/${threadId}`, {
        headers: {
          "X-Admin-ID": admin?.id.toString() || "",
        },
      });
      const data = await response.json();
      if (data.success) {
        setCurrentMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching thread:", error);
    }
  };

  const handleThreadSelect = (threadId: string) => {
    setSelectedThread(threadId);
    fetchThreadMessages(threadId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.content.trim() || !newMessage.recipient_id || !admin) return;

    setSending(true);
    setError("");

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
          recipient_id: parseInt(newMessage.recipient_id),
          subject: newMessage.subject || "Re: Application Update",
          content: newMessage.content,
          thread_id: selectedThread || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage({ subject: "", content: "", recipient_id: "" });
        setShowCompose(false);
        if (selectedThread) {
          fetchThreadMessages(selectedThread);
        } else {
          fetchThreads();
        }
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      setError("Network error. Ensure backend is running.");
    } finally {
      setSending(false);
    }
  };

  const getApplicantById = (applicantId: number): Applicant | undefined => {
    return applications.find((a: any) => a.applicant_id === applicantId || a.id === applicantId) as any;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredThreads = useMemo(() => {
    return threads
      .filter((thread) => {
        const matchesSearch = thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            thread.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === "unread") return !thread.is_read && matchesSearch;
        if (filter === "sent") return thread.sender_type === "admin" && matchesSearch;
        return matchesSearch;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [threads, searchTerm, filter]);

  const totalPages = Math.ceil(filteredThreads.length / itemsPerPage);
  const paginatedThreads = filteredThreads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
          <p className="text-slate-500 mt-1">Manage applicant communications</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1d4746] text-white rounded-xl hover:bg-[#1d4746]/90"
        >
          <MessageSquare className="w-4 h-4" />
          Compose
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sidebar - Thread List */}
        <div className="col-span-1 bg-white rounded-xl border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746]"
              />
            </div>
          </div>
          <div className="flex border-b border-slate-200">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`flex-1 py-3 text-sm font-medium ${filter === f ? "text-[#1d4746] border-b-2 border-[#1d4746]" : "text-slate-500 hover:text-slate-700"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading messages...</div>
            ) : paginatedThreads.length > 0 ? (
              paginatedThreads.map((thread) => {
                const applicant = getApplicantById(thread.sender_id);
                const isSelected = selectedThread === thread.thread_id;
                return (
                  <button
                    key={thread.thread_id}
                    onClick={() => handleThreadSelect(thread.thread_id)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${isSelected ? "bg-slate-50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`font-medium ${!thread.is_read ? "text-slate-800" : "text-slate-600"}`}>
                        {applicant ? `${applicant.first_name} ${applicant.last_name}` : "Unknown"}
                      </p>
                      <span className="text-xs text-slate-400">{formatTime(thread.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium truncate">{thread.subject}</p>
                    <p className="text-xs text-slate-500 truncate mt-1 line-clamp-2">{thread.content}</p>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500">No messages found</div>
            )}
          </div>
        </div>

        {/* Main Content - Conversation View */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col">
          {selectedThread ? (
            <>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">
                  {currentMessages[0]?.subject || "Conversation"}
                </h2>
                <button
                  onClick={() => setSelectedThread(null)}
                  className="mt-2 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to inbox
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentMessages.map((msg) => {
                  const isFromApplicant = msg.sender_type === "applicant";
                  const applicant = isFromApplicant ? getApplicantById(msg.sender_id) : null;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isFromApplicant ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[80%] ${isFromApplicant ? "order-2" : "order-1"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isFromApplicant ? (
                            <>
                              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600" />
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {applicant ? `${applicant.first_name} ${applicant.last_name}` : "Applicant"}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-slate-700">You</span>
                              <div className="w-8 h-8 bg-[#1d4746] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{admin?.first_name?.[0]}{admin?.last_name?.[0]}</span>
                              </div>
                            </>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          isFromApplicant 
                            ? "bg-slate-100 text-slate-800 rounded-tl-none" 
                            : "bg-[#1d4746] text-white rounded-tr-none"
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <div className="p-4 border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="space-y-3">
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    placeholder="Type your reply..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746] resize-none"
                    rows={3}
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sending || !newMessage.content.trim()}
                      className="px-4 py-2 bg-[#1d4746] text-white rounded-lg hover:bg-[#1d4746]/90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending ? "Sending..." : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500">
              <Inbox className="w-12 h-12 mb-4" />
              <p>Select a conversation to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
