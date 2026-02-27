import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Landing Page Components
import LandingPage from './pages/landing/LandingPage';

// Auth Components
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Applicant Dashboard Components
import ApplicantDashboard from './pages/applicant/Dashboard';
import ApplicationForm from './pages/applicant/ApplicationForm';
import ApplicationStatus from './pages/applicant/ApplicationStatus';
import Payment from './pages/applicant/Payment';
import Profile from './pages/applicant/Profile';
import ChangePassword from './pages/applicant/ChangePassword';

// Admin Dashboard Components
import AdminDashboard from './pages/admin/Dashboard';
import Applications from './pages/admin/Applications';
import Programs from './pages/admin/Programs';
import Notices from './pages/admin/Notices';
import Enquiries from './pages/admin/Enquiries';
import Subscribers from './pages/admin/Subscribers';

// Layout Components
import PrivateRoute from './components/layout/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute';

function App() {
  const { isAuthenticated, isAdmin, isApplicant, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--background)'
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Applicant Routes */}
      <Route path="/applicant" element={
        <PrivateRoute>
          <ApplicantDashboard />
        </PrivateRoute>
      } />
      <Route path="/applicant/application" element={
        <PrivateRoute requiredRole="applicant">
          <ApplicationForm />
        </PrivateRoute>
      } />
      <Route path="/applicant/status" element={
        <PrivateRoute requiredRole="applicant">
          <ApplicationStatus />
        </PrivateRoute>
      } />
      <Route path="/applicant/payment" element={
        <PrivateRoute requiredRole="applicant">
          <Payment />
        </PrivateRoute>
      } />
      <Route path="/applicant/profile" element={
        <PrivateRoute requiredRole="applicant">
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/applicant/change-password" element={
        <PrivateRoute requiredRole="applicant">
          <ChangePassword />
        </PrivateRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/applications" element={
        <AdminRoute>
          <Applications />
        </AdminRoute>
      } />
      <Route path="/admin/programs" element={
        <AdminRoute>
          <Programs />
        </AdminRoute>
      } />
      <Route path="/admin/notices" element={
        <AdminRoute>
          <Notices />
        </AdminRoute>
      } />
      <Route path="/admin/enquiries" element={
        <AdminRoute>
          <Enquiries />
        </AdminRoute>
      } />
      <Route path="/admin/subscribers" element={
        <AdminRoute>
          <Subscribers />
        </AdminRoute>
      } />

      {/* Redirects */}
      <Route path="/dashboard" element={
        isAuthenticated ? (
          isAdmin ? <Navigate to="/admin" /> : <Navigate to="/applicant" />
        ) : (
          <Navigate to="/login" />
        )
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
