import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('admissionPortalUser');
      const storedToken = localStorage.getItem('admissionPortalToken');
      
      if (storedUser && storedToken) {
        try {
          // Verify token is still valid by fetching user data
          const response = await authAPI.getUser();
          if (response.success) {
            setUser(response.data);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('admissionPortalUser');
            localStorage.removeItem('admissionPortalToken');
          }
        } catch (err) {
          // Token invalid or expired, clear storage
          localStorage.removeItem('admissionPortalUser');
          localStorage.removeItem('admissionPortalToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { user: userData, token } = response.data;
        setUser(userData);
        localStorage.setItem('admissionPortalUser', JSON.stringify(userData));
        localStorage.setItem('admissionPortalToken', token);
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.signup(userData);
      
      if (response.success) {
        const { user: newUser, token } = response.data;
        setUser(newUser);
        localStorage.setItem('admissionPortalUser', JSON.stringify(newUser));
        localStorage.setItem('admissionPortalToken', token);
        return newUser;
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      setUser(null);
      localStorage.removeItem('admissionPortalUser');
      localStorage.removeItem('admissionPortalToken');
    }
  };

  const updateUser = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);
      if (response.success) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('admissionPortalUser', JSON.stringify(updatedUser));
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Update failed');
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword);
      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Password change failed');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isApplicant: user?.role === 'applicant'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
