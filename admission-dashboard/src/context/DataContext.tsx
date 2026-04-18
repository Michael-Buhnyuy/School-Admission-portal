import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Application {
  id: string;
  [key: string]: any;
}

interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
  capacity: number;
}

interface Notice {
  id: number;
  title?: string;
  content?: string;
  date?: string;
  [key: string]: any;
}

interface Enquiry {
  id: number;
  name?: string;
  email?: string;
  message?: string;
  date?: string;
  status?: string;
  response?: string;
  responseDate?: string;
  [key: string]: any;
}

interface User {
  id: number;
  [key: string]: any;
}

interface DataContextType {
  applications: Application[];
  programs: Program[];
  notices: Notice[];
  enquiries: Enquiry[];
  registeredUsers: User[];
  addApplication: (application: Application) => Application;
  updateApplicationStatus: (applicationId: string, status: string, letter?: string | null) => void;
  getApplicationById: (applicationId: string) => Application | undefined;
  addProgram: (program: Program) => void;
  addNotice: (notice: Notice) => void;
  deleteNotice: (noticeId: number) => void;
  addEnquiry: (enquiry: Enquiry) => void;
  markEnquiryAsRead: (enquiryId: number) => void;
  deleteEnquiry: (enquiryId: number) => void;
  respondToEnquiry: (enquiryId: number, response: string) => void;
  registerUser: (user: User) => User;
  fetchApplications: () => void;
  totalApplications: number;
  pendingApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Initialize from localStorage if available
  const [applications, setApplications] = useState(() => {
    const stored = localStorage.getItem('admissionPortalApplications');
    return stored ? JSON.parse(stored) : [];
  });

  const [programs, setPrograms] = useState(() => {
    const stored = localStorage.getItem('admissionPortalPrograms');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'Science', description: 'Explore the wonders of physics, chemistry, and biology', duration: '4 Years', capacity: 100 },
      { id: 2, name: 'Arts', description: 'Develop your creative potential with studies in literature, history, and fine arts', duration: '4 Years', capacity: 80 },
      { id: 3, name: 'Commerce', description: 'Master business principles, accounting, and economics', duration: '4 Years', capacity: 120 },
      { id: 4, name: 'Engineering', description: 'Build the future with cutting-edge engineering and technology programs', duration: '5 Years', capacity: 100 },
      { id: 5, name: 'Medicine', description: 'Train to become a healthcare professional', duration: '6 Years', capacity: 50 },
      { id: 6, name: 'Law', description: 'Shape justice and society with comprehensive law degree', duration: '5 Years', capacity: 60 }
    ];
  });

  const [notices, setNotices] = useState(() => {
    const stored = localStorage.getItem('admissionPortalNotices');
    return stored ? JSON.parse(stored) : [];
  });

  const [enquiries, setEnquiries] = useState(() => {
    const stored = localStorage.getItem('admissionPortalEnquiries');
    return stored ? JSON.parse(stored) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const stored = localStorage.getItem('admissionPortalUsers');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('admissionPortalApplications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('admissionPortalPrograms', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('admissionPortalNotices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('admissionPortalEnquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('admissionPortalUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Application functions
  const addApplication = (application) => {
    const newApplication = {
      ...application,
      id: `APP-${Date.now()}`,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setApplications(prev => [...prev, newApplication]);
    return newApplication;
  };

  const updateApplicationStatus = (applicationId, status, letter = null) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { 
        ...app, 
        status,
        letter: letter || app.letter,
        letterDate: letter ? new Date().toISOString() : app.letterDate
      } : app
    ));
  };

  const getApplicationById = (applicationId) => {
    return applications.find(app => app.id === applicationId);
  };

  // Program functions
  const addProgram = (program) => {
    const newProgram = {
      ...program,
      id: Date.now()
    };
    setPrograms(prev => [...prev, newProgram]);
  };

  // Notice functions
  const addNotice = (notice) => {
    const newNotice = {
      ...notice,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [...prev, newNotice]);
  };

  const deleteNotice = (noticeId) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  // Enquiry functions
  const addEnquiry = (enquiry) => {
    const newEnquiry = {
      ...enquiry,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'unread'
    };
    setEnquiries(prev => [...prev, newEnquiry]);
  };

  const markEnquiryAsRead = (enquiryId) => {
    setEnquiries(prev => prev.map(e => 
      e.id === enquiryId ? { ...e, status: 'read' } : e
    ));
  };

  const deleteEnquiry = (enquiryId) => {
    setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
  };

  const respondToEnquiry = (enquiryId, response) => {
    setEnquiries(prev => prev.map(e => 
      e.id === enquiryId ? { 
        ...e, 
        response: response,
        responseDate: new Date().toISOString().split('T')[0],
        status: 'resolved'
      } : e
    ));
  };

  // User registration
  const registerUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now(),
      registrationDate: new Date().toISOString().split('T')[0]
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Fetch applications - for now just ensures localStorage data is loaded
  const fetchApplications = () => {
    const stored = localStorage.getItem('admissionPortalApplications');
    if (stored) {
      setApplications(JSON.parse(stored));
    }
  };

  // Computed values
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const selectedApplications = applications.filter(app => app.status === 'selected').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

  const value = {
    // Data
    applications,
    programs,
    notices,
    enquiries,
    registeredUsers,
    // Application functions
    addApplication,
    updateApplicationStatus,
    getApplicationById,
    fetchApplications,
    // Program functions
    addProgram,
    // Notice functions
    addNotice,
    deleteNotice,
    // Enquiry functions
    addEnquiry,
    markEnquiryAsRead,
    deleteEnquiry,
    respondToEnquiry,
    // User functions
    registerUser,
    // Computed values
    totalApplications,
    pendingApplications,
    selectedApplications,
    rejectedApplications
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
