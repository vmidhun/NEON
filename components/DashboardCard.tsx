
import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm animate-enter ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
