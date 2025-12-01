
import React from 'react';
import { EMPLOYEES } from '../constants';
import { Employee, UserRole } from '../types';
import DashboardCard from './DashboardCard';

const TeamMemberCard: React.FC<{ member: Employee }> = ({ member }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-200">
    <div className="flex items-center gap-4">
      <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full" />
      <div>
        <p className="font-semibold">{member.name}</p>
        <p className="text-sm text-slate-500">Checked In: 9:05 AM</p>
      </div>
    </div>
    <div className="text-right">
        <p className="font-semibold">4.5 / 8.0 hrs</p>
        <div className="w-24 bg-slate-200 rounded-full h-2 mt-1">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(4.5/8)*100}%` }}></div>
        </div>
    </div>
  </div>
);

const ScrumMasterDashboard: React.FC = () => {
  // Assuming the logged-in scrum master is Liam, who is on team_alpha
  const teamMembers = EMPLOYEES.filter(e => e.teamId === 'team_alpha' && e.role === UserRole.Employee);
  
  return (
    <div>
        <DashboardCard title="Team Standup View: Alpha Squad">
            <div className="space-y-4">
                {teamMembers.map(member => <TeamMemberCard key={member.id} member={member} />)}
            </div>
        </DashboardCard>
    </div>
  );
};

export default ScrumMasterDashboard;
