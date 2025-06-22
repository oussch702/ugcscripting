import React from 'react';
import { 
  MessageCircle, 
  Settings, 
  BarChart3, 
  Users, 
  Video, 
  FileText, 
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  Clock,
  TrendingUp,
  Folder,
  History
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  projectHistory: Array<{
    id: string;
    name: string;
    date: Date;
    scriptCount: number;
  }>;
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  toggleSidebarCollapse,
  projectHistory,
  onProjectSelect,
  onNewProject
}) => {
  const sidebarItems = [
    { id: 'chat' as ViewType, icon: MessageCircle, label: 'AI Chat', color: 'text-blue-600' },
    { id: 'video-creator' as ViewType, icon: Video, label: 'Video Creator', color: 'text-purple-600' },
    { id: 'scripts' as ViewType, icon: FileText, label: 'Scripts', color: 'text-green-600' },
    { id: 'performance' as ViewType, icon: TrendingUp, label: 'Performance', color: 'text-orange-600' },
    { id: 'analytics' as ViewType, icon: BarChart3, label: 'Analytics', color: 'text-indigo-600' },
    { id: 'team' as ViewType, icon: Users, label: 'Team', color: 'text-pink-600' },
    { id: 'calendar' as ViewType, icon: Calendar, label: 'Calendar', color: 'text-teal-600' },
  ];

  const handleViewChange = (view: ViewType) => {
    onViewChange(view);
    setSidebarOpen(false);
  };

  return (
    <div className={`${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 fixed md:relative z-50 ${
      sidebarCollapsed ? 'w-16' : 'w-80'
    } h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-gray-800 text-lg">MindCue</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!sidebarCollapsed && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <button 
              onClick={toggleSidebarCollapse}
              className="hidden md:block p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* New Project Button */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onNewProject}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        )}

        {/* Project History */}
        {!sidebarCollapsed && projectHistory.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
              <History className="w-4 h-4 mr-2" />
              Recent Projects
            </h3>
            <div className="space-y-2">
              {projectHistory.slice(0, 5).map((project) => (
                <button
                  key={project.id}
                  onClick={() => onProjectSelect(project.id)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                >
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 truncate">
                    📁 {project.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                    <span>{project.date.toLocaleDateString()}</span>
                    <span>{project.scriptCount} scripts</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4">
          {!sidebarCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Navigation
            </h3>
          )}
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`w-full flex items-center ${
                  sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'
                } py-3 rounded-lg transition-all duration-200 text-left group relative ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 ${
                  currentView === item.id ? item.color : 'text-gray-400'
                } ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button className={`w-full flex items-center ${
          sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'
        } py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 group relative`}
        title={sidebarCollapsed ? 'Settings' : ''}>
          <Settings className={`w-5 h-5 text-gray-400 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
          {!sidebarCollapsed && (
            <span className="font-medium">Settings</span>
          )}
          
          {/* Tooltip for collapsed state */}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              Settings
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;