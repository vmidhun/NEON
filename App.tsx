import React, { useState, useEffect } from 'react';
import { UserRole, Employee } from './types';
import { EMPLOYEES } from './constants'; 
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import ScrumMasterDashboard from './components/ScrumMasterDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './LoginPage';
import { AuthProvider, useAuth } from './AuthContext';


// Main application content after login
const MainAppContent: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const availableRoles = [UserRole.Employee, UserRole.ScrumMaster, UserRole.HR, UserRole.Admin];
  
  // For demo purposes, allow switching the current user's role to see different dashboards.
  // In a real app, the role would come strictly from the logged-in user's data.
  const [currentViewRole, setCurrentViewRole] = useState<UserRole>(user?.role || UserRole.Employee);

  // Update currentViewRole if the logged-in user changes or if it's initially set.
  useEffect(() => {
    if (user && user.role !== currentViewRole) {
      setCurrentViewRole(user.role);
    }
  }, [user, currentViewRole]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentViewRole(role);
  };
  
  const renderDashboard = () => {
    if (!user) return null; // Should not happen if isLoggedIn is true

    // Use currentViewRole for rendering dashboards
    switch (currentViewRole) {
      case UserRole.Employee:
        return <EmployeeDashboard currentUser={user} />;
      case UserRole.ScrumMaster:
        return <ScrumMasterDashboard currentUser={user} />;
      case UserRole.HR:
        return <ReportsDashboard currentUser={user} />;
      case UserRole.Admin:
        return <AdminDashboard currentUser={user} />;
      default:
        return <EmployeeDashboard currentUser={user} />;
    }
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <>
      <Header 
        currentUser={user}
        availableRoles={availableRoles}
        onRoleChange={handleRoleChange}
        currentViewRole={currentViewRole}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {renderDashboard()}
      </main>
    </>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
};

const AppWrapper: React.FC = () => {
  const { isLoggedIn, user, token } = useAuth();

  // Show a loading spinner or similar while checking auth status
  // isInitializing in AuthContext handles this
  // if (token === null && localStorage.getItem('jwtToken')) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-slate-100">
  //       <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //       </svg>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-slate-100">
      {isLoggedIn ? <MainAppContent /> : <LoginPage />}
    </div>
  );
};

export default App;