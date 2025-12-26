import React, { useState, useEffect } from 'react';
import { UserRole, Employee } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import ProjectsPage from './components/ProjectsPage';
import TasksPage from './components/TasksPage';
import TeamPage from './components/TeamPage';
import LeavePage from './components/LeavePage';
import TimesheetPage from './components/TimesheetPage';
import StandupPage from './components/StandupPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import HelpCenter from './components/HelpCenter';
import LoginPage from './LoginPage';
import { AuthProvider, useAuth } from './AuthContext';

const MainAppContent: React.FC = () => {
  const { user, isLoggedIn, entitlements } = useAuth();
  const availableRoles = [UserRole.Employee, UserRole.Manager, UserRole.HR, UserRole.Admin];
  const [currentViewRole, setCurrentViewRole] = useState<UserRole>(user?.role || UserRole.Employee);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    if (user && user.role !== currentViewRole) {
      setCurrentViewRole(user.role);
    }
  }, [user]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentViewRole(role);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const isEnabled = (key: string) => {
    if (!entitlements) return true;
    return entitlements[key]?.value === true;
  };

  const renderContent = () => {
    if (!user) return null;

    // Feature Gates
    if (currentPage === 'projects' && !isEnabled('project_management')) return <div className="p-8 text-center text-slate-500">Feature not enabled in your plan.</div>;
    if (currentPage === 'tasks' && !isEnabled('project_management')) return <div className="p-8 text-center text-slate-500">Feature not enabled in your plan.</div>;
    if (currentPage === 'timesheets' && !isEnabled('timesheet')) return <div className="p-8 text-center text-slate-500">Feature not enabled in your plan.</div>;
    if (currentPage === 'standup' && !isEnabled('team_standup')) return <div className="p-8 text-center text-slate-500">Feature not enabled in your plan.</div>;
    if (currentPage === 'leaves' && !isEnabled('leave_management')) return <div className="p-8 text-center text-slate-500">Feature not enabled in your plan.</div>;
    if (currentPage === 'reports' && !isEnabled('reports')) return <div className="p-8 text-center text-slate-500">Feature not enabled in your plan.</div>;

    if (currentPage === 'projects') return <ProjectsPage />;
    if (currentPage === 'tasks') return <TasksPage />;
    if (currentPage === 'timesheets') return <TimesheetPage />;
    if (currentPage === 'standup') return <StandupPage />;
    if (currentPage === 'team') return <TeamPage />;
    if (currentPage === 'leaves') return <LeavePage />;
    if (currentPage === 'reports') return <ReportsPage />;
    if (currentPage === 'settings') return <SettingsPage currentUserRole={currentViewRole} />;
    if (currentPage === 'help') return <HelpCenter currentUserRole={currentViewRole} />;

    switch (currentViewRole) {
      case UserRole.Employee:
        return <EmployeeDashboard currentUser={user} onNavigate={handleNavigate} />;
      case UserRole.Manager:
        return <ManagerDashboard currentUser={user} />;
      case UserRole.HR:
        return <ReportsDashboard currentUser={user} />;
      case UserRole.Admin:
        return <AdminDashboard currentUser={user} />;
      case UserRole.SuperAdmin:
        return <SuperAdminDashboard />;
      default:
        return <EmployeeDashboard currentUser={user} />;
    }
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  if (user.role === UserRole.SuperAdmin) {
    console.log("Rendering SuperAdminDashboard for user:", user);
    return <SuperAdminDashboard />;
  }

  console.log("Current User Role:", user.role, "Visible View:", currentViewRole);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentRole={currentViewRole}
        activePage={currentPage}
        onNavigate={handleNavigate}
        currentUser={user}
        availableRoles={availableRoles}
        onRoleChange={handleRoleChange}
      />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header
        currentUser={user}
        availableRoles={availableRoles}
        onRoleChange={handleRoleChange}
        currentViewRole={currentViewRole}
      />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
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