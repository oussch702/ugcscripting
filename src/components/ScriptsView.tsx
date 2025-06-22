import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit3,
  Copy,
  Download,
  MoreVertical,
  Eye,
  Play
} from 'lucide-react';

interface Script {
  id: string;
  title: string;
  concept: string;
  status: 'draft' | 'ready-for-review' | 'changes-requested' | 'approved' | 'rejected';
  duration: string;
  ctr: string;
  cvr: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  project: string;
  tags: string[];
}

const ScriptsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated');

  const mockScripts: Script[] = [
    {
      id: '1',
      title: 'Problem-Solution Hook',
      concept: 'CloudSync Pro - Security Focus',
      status: 'approved',
      duration: '15s',
      ctr: '8.3%',
      cvr: '4.1%',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      createdBy: 'Emma Davis',
      project: 'CloudSync Pro Campaign',
      tags: ['security', 'b2b', 'problem-solution']
    },
    {
      id: '2',
      title: 'Social Proof Opener',
      concept: 'CloudSync Pro - Testimonials',
      status: 'ready-for-review',
      duration: '15s',
      ctr: '7.8%',
      cvr: '3.9%',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15'),
      createdBy: 'Mike Chen',
      project: 'CloudSync Pro Campaign',
      tags: ['social-proof', 'testimonials', 'b2b']
    },
    {
      id: '3',
      title: 'Feature Demo Focus',
      concept: 'CloudSync Pro - Product Demo',
      status: 'changes-requested',
      duration: '20s',
      ctr: '7.2%',
      cvr: '3.7%',
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14'),
      createdBy: 'Emma Davis',
      project: 'CloudSync Pro Campaign',
      tags: ['demo', 'features', 'product']
    },
    {
      id: '4',
      title: 'Fitness Challenge Hook',
      concept: 'FitTracker - Motivation Focus',
      status: 'draft',
      duration: '12s',
      ctr: '6.5%',
      cvr: '3.2%',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-13'),
      createdBy: 'Alex Rodriguez',
      project: 'FitTracker App Launch',
      tags: ['fitness', 'motivation', 'challenge']
    }
  ];

  const getStatusIcon = (status: Script['status']) => {
    switch (status) {
      case 'draft':
        return <Edit3 className="w-4 h-4 text-gray-500" />;
      case 'ready-for-review':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'changes-requested':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Script['status']) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'ready-for-review':
        return 'Ready for Review';
      case 'changes-requested':
        return 'Changes Requested';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Script['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'ready-for-review':
        return 'bg-blue-100 text-blue-700';
      case 'changes-requested':
        return 'bg-orange-100 text-orange-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredScripts = mockScripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || script.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedScripts = [...filteredScripts].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">📝 Scripts Library</h1>
            <p className="text-gray-600">Manage and organize your video scripts</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            <Plus className="w-4 h-4" />
            <span>New Script</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="ready-for-review">Ready for Review</option>
              <option value="changes-requested">Changes Requested</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedScripts.map((script) => (
          <div key={script.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{script.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{script.concept}</p>
                <p className="text-xs text-gray-500">{script.project}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Star className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {getStatusIcon(script.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(script.status)}`}>
                {getStatusLabel(script.status)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="font-medium">{script.duration}</div>
              </div>
              <div>
                <div className="text-gray-500">CTR</div>
                <div className="font-medium">{script.ctr}</div>
              </div>
              <div>
                <div className="text-gray-500">CVR</div>
                <div className="font-medium">{script.cvr}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {script.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              <div>Created by {script.createdBy}</div>
              <div>Updated {script.updatedAt.toLocaleDateString()}</div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm">
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedScripts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No scripts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first script to get started'
            }
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Create New Script
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptsView;