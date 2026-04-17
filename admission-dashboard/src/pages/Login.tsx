import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Lock, User, Shield, Eye, EyeOff, Sparkles } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      navigate("/app/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1d4746] relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1d4746] via-[#0f2e2d] to-[#1d4746]"></div>
          
          {/* Geometric patterns */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#e88418]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-white/5 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Admission Portal</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Admin<br />Dashboard
          </h1>
          
          <p className="text-lg text-white/70 leading-relaxed max-w-md">
            Manage applications, review documents, and process admissions efficiently from a centralized platform.
          </p>

          {/* Features list */}
          <div className="mt-12 space-y-4">
            {[
              "Real-time application tracking",
              "Document management & verification",
              "Analytics & reporting",
              "Multi-role access control"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white/80">
                <div className="w-6 h-6 rounded-full bg-[#e88418]/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-[#e88418]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="absolute bottom-8 left-12 right-12">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure Admin Access • 2024</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 bg-[#1d4746] rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1d4746]">Admission Portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#1d4746] to-[#2a5f5e] rounded-2xl mb-4 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500">
                Enter your credentials to access the dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d4746] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4746] focus:border-transparent focus:bg-white transition-all"
                    placeholder="admin@university.edu"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d4746] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4746] focus:border-transparent focus:bg-white transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#1d4746] focus:ring-[#1d4746] cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-[#e88418] hover:text-[#d67610] font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#e88418] to-[#f59e0b] hover:from-[#d67610] hover:to-[#e88418] text-white font-semibold py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-slate-400" />
                <p className="text-center text-slate-500 text-sm font-medium">
                  Demo Credentials
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-gradient-to-r from-slate-50 to-white rounded-lg p-3 border border-slate-100 hover:border-[#1d4746]/30 transition-colors">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Super Admin</p>
                  <p className="text-[#1d4746] font-semibold text-sm">john.smith@admission.edu</p>
                  <p className="text-slate-500 text-xs">Password: admin123</p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-white rounded-lg p-3 border border-slate-100 hover:border-[#1d4746]/30 transition-colors">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Admission Officer</p>
                  <p className="text-[#1d4746] font-semibold text-sm">sarah.johnson@admission.edu</p>
                  <p className="text-slate-500 text-xs">Password: admin123</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile footer */}
          <p className="text-center text-slate-400 text-xs mt-6 lg:hidden">
            © 2024 Admission Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
