
import React, { useState, useMemo } from 'react';
import { UserRole, Employee } from './types';
import { EMPLOYEES } from './constants';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import ScrumMasterDashboard from './components/ScrumMasterDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import AdminDashboard from './components/AdminDashboard';


const App: React.FC = () => {
  // All possible roles for the switcher UI
  const availableRoles = [UserRole.Employee, UserRole.ScrumMaster, UserRole.HR, UserRole.Admin];

  // We'll use the first employee as the default and allow changing their role for demo purposes.
  const [currentUser, setCurrentUser] = useState<Employee>(EMPLOYEES[0]);

  const handleRoleChange = (role: UserRole) => {
    // Find a user with that role to switch to, or update current user's role for the demo
    const userForRole = EMPLOYEES.find(e => e.role === role) || { ...currentUser, role };
    setCurrentUser(userForRole);
  };
  
  const renderDashboard = () => {
    switch (currentUser.role) {
      case UserRole.Employee:
        return <EmployeeDashboard />;
      case UserRole.ScrumMaster:
        return <ScrumMasterDashboard />;
      case UserRole.HR:
        return <ReportsDashboard />;
      case UserRole.Admin:
        return <AdminDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header 
        currentUser={currentUser} 
        availableRoles={availableRoles}
        onRoleChange={handleRoleChange}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;
