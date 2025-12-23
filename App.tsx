import React, { useState, useEffect } from 'react';
import { UserRole, Employee } from './types';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import ScrumMasterDashboard from './components/ScrumMasterDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './LoginPage';
import { AuthProvider, useAuth } from './AuthContext';

const MainAppContent: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const availableRoles = [UserRole.Employee, UserRole.ScrumMaster, UserRole.HR, UserRole.Admin];
  const [currentViewRole, setCurrentViewRole] = useState<UserRole>(user?.role || UserRole.Employee);

  useEffect(() => {
    if (user && user.role !== currentViewRole) {
      setCurrentViewRole(user.role);
    }
  }, [user]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentViewRole(role);
  };
  
  const renderDashboard = () => {
    if (!user) return null;

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

const AppWrapper: React.FC = () => {
  const { isLoggedIn, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing Secure Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {isLoggedIn ? <MainAppContent /> : <LoginPage />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
};

export default App;