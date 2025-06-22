import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Users, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  Award,
  Zap
} from 'lucide-react';

const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('ctr');

  const overviewStats = [
    {
      label: 'Total Views',
      value: '2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      label: 'Click-Through Rate',
      value: '8.3%',
      change: '+2.1%',
      trend: 'up',
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      label: 'Conversion Rate',
      value: '4.1%',
      change: '-0.3%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      label: 'Revenue',
      value: '$48.2K',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ];

  const topPerformingScripts = [
    {
      id: '1',
      title: 'Problem-Solution Hook',
      views: '450K',
      ctr: '8.3%',
      cvr: '4.1%',
      revenue: '$12.4K',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Social Proof Opener',
      views: '380K',
      ctr: '7.8%',
      cvr: '3.9%',
      revenue: '$10.8K',
      trend: 'up'
    },
    {
      id: '3',
      title: 'Feature Demo Focus',
      views: '320K',
      ctr: '7.2%',
      cvr: '3.7%',
      revenue: '$9.2K',
      trend: 'stable'
    },
    {
      id: '4',
      title: 'Before & After Story',
      views: '280K',
      ctr: '6.8%',
      cvr: '3.4%',
      revenue: '$7.8K',
      trend: 'down'
    }
  ];

  const audienceInsights = [
    {
      segment: 'Business Professionals',
      percentage: 45,
      ctr: '8.7%',
      cvr: '4.3%',
      color: 'bg-blue-500'
    },
    {
      segment: 'Tech Enthusiasts',
      percentage: 30,
      ctr: '7.9%',
      cvr: '3.8%',
      color: 'bg-green-500'
    },
    {
      segment: 'Small Business Owners',
      percentage: 15,
      ctr: '8.1%',
      cvr: '4.0%',
      color: 'bg-orange-500'
    },
    {
      segment: 'Enterprise Teams',
      percentage: 10,
      ctr: '9.2%',
      cvr: '4.8%',
      color: 'bg-purple-500'
    }
  ];

  const campaignPerformance = [
    {
      campaign: 'CloudSync Pro Launch',
      scripts: 8,
      totalViews: '1.2M',
      avgCtr: '8.1%',
      avgCvr: '4.0%',
      revenue: '$28.5K',
      status: 'Active'
    },
    {
      campaign: 'FitTracker App Promo',
      scripts: 6,
      totalViews: '850K',
      avgCtr: '7.5%',
      avgCvr: '3.6%',
      revenue: '$15.2K',
      status: 'Completed'
    },
    {
      campaign: 'E-commerce Platform',
      scripts: 4,
      totalViews: '420K',
      avgCtr: '6.9%',
      avgCvr: '3.2%',
      revenue: '$8.8K',
      status: 'Paused'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      case 'Paused':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">📊 Analytics Dashboard</h1>
            <p className="text-gray-600">Track performance and insights across all your campaigns</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {overviewStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('600', '100')} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(stat.trend)}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">📈 Performance Trends</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('ctr')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'ctr' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                CTR
              </button>
              <button
                onClick={() => setSelectedMetric('cvr')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'cvr' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                CVR
              </button>
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'revenue' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>
          
          {/* Placeholder for chart */}
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-gray-600">Performance chart visualization</p>
              <p className="text-sm text-gray-500">Showing {selectedMetric.toUpperCase()} trends over {timeRange}</p>
            </div>
          </div>
        </div>

        {/* Audience Insights */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">👥 Audience Breakdown</h2>
          <div className="space-y-4">
            {audienceInsights.map((segment, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                  <span className="text-sm text-gray-600">{segment.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${segment.color}`}
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>CTR: {segment.ctr}</span>
                  <span>CVR: {segment.cvr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Scripts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          🏆 Top Performing Scripts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Script</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">CTR</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">CVR</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topPerformingScripts.map((script, index) => (
                <tr key={script.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-800">{script.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{script.views}</td>
                  <td className="py-3 px-4 text-gray-600">{script.ctr}</td>
                  <td className="py-3 px-4 text-gray-600">{script.cvr}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{script.revenue}</td>
                  <td className="py-3 px-4">{getTrendIcon(script.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">🎯 Campaign Performance</h2>
        <div className="space-y-4">
          {campaignPerformance.map((campaign, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{campaign.campaign}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Scripts</div>
                  <div className="font-medium">{campaign.scripts}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Views</div>
                  <div className="font-medium">{campaign.totalViews}</div>
                </div>
                <div>
                  <div className="text-gray-500">Avg CTR</div>
                  <div className="font-medium">{campaign.avgCtr}</div>
                </div>
                <div>
                  <div className="text-gray-500">Avg CVR</div>
                  <div className="font-medium">{campaign.avgCvr}</div>
                </div>
                <div>
                  <div className="text-gray-500">Revenue</div>
                  <div className="font-medium text-green-600">{campaign.revenue}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;