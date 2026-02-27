import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const storedUser = localStorage.getItem('admissionPortalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@school.com' && password === 'admin123') {
          const userData = {
            id: '1',
            email: 'admin@school.com',
            name: 'Admin User',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
          };
          setUser(userData);
          localStorage.setItem('admissionPortalUser', JSON.stringify(userData));
          resolve(userData);
        } else if (email && password) {
          // Extract name from email (e.g., john.doe@example.com -> John Doe)
          const nameFromEmail = email.split('@')[0]
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
          
          const userData = {
            id: '2',
            email: email,
            name: nameFromEmail,
            role: 'applicant',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            applicationStatus: 'pending',
            applicationId: null
          };
          setUser(userData);
          localStorage.setItem('admissionPortalUser', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.fullName,
          role: 'applicant',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          applicationStatus: 'not_started',
          applicationId: null
        };
        setUser(newUser);
        localStorage.setItem('admissionPortalUser', JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admissionPortalUser');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('admissionPortalUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
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
