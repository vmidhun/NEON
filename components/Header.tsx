

import React from 'react';
import { Employee, UserRole } from '../types';
import { ChevronDownIcon } from '../constants';

interface HeaderProps {
  currentUser: Employee;
  availableRoles: UserRole[];
  onRoleChange: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, availableRoles, onRoleChange }) => {
  return (
    <header className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                N
            </div>
            <h1 className="text-2xl font-bold text-slate-800">NEO</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">View as:</span>
                <select 
                    value={currentUser.role} 
                    onChange={(e) => onRoleChange(e.target.value as UserRole)}
                    className="text-sm font-medium border-none bg-slate-100 rounded-md p-1 focus:ring-2 focus:ring-blue-500"
                >
                    {availableRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded-full" src={currentUser.avatarUrl} alt="" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;