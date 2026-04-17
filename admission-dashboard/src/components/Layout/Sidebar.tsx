import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  GraduationCap,
  Settings,
  ChevronLeft,
  LogOut,
  ClipboardCheck,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
    { icon: Users, label: "Applications", path: "/app/applications" },
    { icon: FileText, label: "Documents", path: "/app/documents" },
    { icon: MessageSquare, label: "Messages", path: "/app/messages" },
    { icon: BarChart3, label: "Reports", path: "/app/reports" },
    { icon: ClipboardCheck, label: "Reviews", path: "/app/reviews" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#1d4746] border-r border-[#1d4746]/50 transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1d4746] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-white font-bold text-lg whitespace-nowrap">
                  Admission
                </h1>
                <p className="text-slate-400 text-xs whitespace-nowrap">
                  Portal System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#e88418] text-white shadow-lg shadow-[#e88418]/25"
                    : "text-slate-300 hover:bg-[#e88418] hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Settings & Toggle */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-300 hover:bg-[#e88418] hover:text-white"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </NavLink>

          <button
            onClick={onToggle}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-300 hover:bg-[#e88418] hover:text-white"
          >
            <ChevronLeft
              className={`w-5 h-5 flex-shrink-0 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
            />
            {!isCollapsed && <span className="font-medium">Collapse</span>}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
