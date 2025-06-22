import React from 'react';
import { 
  Users, 
  Plus, 
  Crown, 
  Shield, 
  Edit3, 
  Eye, 
  MoreVertical, 
  Settings,
  UserMinus,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TeamView: React.FC = () => {
  const { user, userProfile } = useAuth();

  const mockTeamMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'owner',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'creative-director',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@company.com',
      role: 'creator',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      email: 'alex@company.com',
      role: 'viewer',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  const mockTeamStats = {
    scriptsCreatedThisWeek: 12,
    approvalRate: 85,
    averageReviewTime: 4.2,
    activeProjects: 3
  };

  const mockRecentActivity = [
    { user: 'Emma Davis', action: 'created new strategy', time: '2h ago', project: 'CloudSync Pro' },
    { user: 'Mike Chen', action: 'approved Script 3', time: '4h ago', project: 'FitTracker App' },
    { user: 'Emma Davis', action: 'requested changes to Hook 1', time: '1d ago', project: 'CloudSync Pro' },
    { user: 'Sarah Johnson', action: 'assigned new project', time: '2d ago', project: 'E-commerce Launch' }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'creative-director':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'creator':
        return <Edit3 className="w-4 h-4 text-green-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'creative-director':
        return 'Creative Director';
      case 'creator':
        return 'Creator';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">👥 Team Management</h1>
            <p className="text-gray-600">Manage your team members and collaboration</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            <Plus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Team Performance Dashboard */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          📊 Team Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{mockTeamStats.scriptsCreatedThisWeek}</div>
            <div className="text-sm text-gray-600">Scripts This Week</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-green-600">{mockTeamStats.approvalRate}%</div>
            <div className="text-sm text-gray-600">Approval Rate</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-orange-600">{mockTeamStats.averageReviewTime}h</div>
            <div className="text-sm text-gray-600">Avg Review Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">{mockTeamStats.activeProjects}</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Team Members</h2>
        <div className="space-y-4">
          {mockTeamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(member.role)}
                  <span className="text-sm font-medium text-gray-700">{getRoleLabel(member.role)}</span>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Recent Activity</h2>
        <div className="space-y-3">
          {mockRecentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.project}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamView;