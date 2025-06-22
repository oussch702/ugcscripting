import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Video, 
  FileText, 
  Users, 
  Filter,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'script-creation' | 'video-production' | 'review' | 'campaign-launch' | 'meeting';
  date: Date;
  time: string;
  duration: string;
  assignee: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  project: string;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Create Problem-Solution Scripts',
      type: 'script-creation',
      date: new Date(2024, 0, 15),
      time: '09:00',
      duration: '2h',
      assignee: 'Emma Davis',
      status: 'scheduled',
      project: 'CloudSync Pro Campaign'
    },
    {
      id: '2',
      title: 'Video Production - Hook 1',
      type: 'video-production',
      date: new Date(2024, 0, 16),
      time: '14:00',
      duration: '4h',
      assignee: 'Mike Chen',
      status: 'in-progress',
      project: 'CloudSync Pro Campaign'
    },
    {
      id: '3',
      title: 'Script Review Session',
      type: 'review',
      date: new Date(2024, 0, 17),
      time: '10:00',
      duration: '1h',
      assignee: 'Sarah Johnson',
      status: 'scheduled',
      project: 'FitTracker App Launch'
    },
    {
      id: '4',
      title: 'Campaign Launch',
      type: 'campaign-launch',
      date: new Date(2024, 0, 20),
      time: '08:00',
      duration: '30m',
      assignee: 'Team',
      status: 'scheduled',
      project: 'E-commerce Platform'
    },
    {
      id: '5',
      title: 'Weekly Team Sync',
      type: 'meeting',
      date: new Date(2024, 0, 18),
      time: '15:00',
      duration: '1h',
      assignee: 'All Team',
      status: 'scheduled',
      project: 'General'
    }
  ];

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'script-creation':
        return <FileText className="w-4 h-4" />;
      case 'video-production':
        return <Video className="w-4 h-4" />;
      case 'review':
        return <Edit3 className="w-4 h-4" />;
      case 'campaign-launch':
        return <Calendar className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'script-creation':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video-production':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'review':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'campaign-launch':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'meeting':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-blue-50' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && (
              <div className="text-xs text-gray-500">+{events.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = mockEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">📅 Content Calendar</h1>
            <p className="text-gray-600">Plan and schedule your content creation workflow</p>
          </div>
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex space-x-2">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Body */}
            <div className="grid grid-cols-7">
              {renderCalendarGrid()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Add */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Add</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Script Creation</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                <Video className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Video Production</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                <Edit3 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Review Session</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Campaign Launch</span>
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Upcoming Events</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getEventTypeIcon(event.type)}
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {event.title}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>{event.date.toLocaleDateString()} at {event.time}</div>
                    <div className="flex items-center justify-between">
                      <span>{event.assignee}</span>
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🏷️ Event Types</h3>
            <div className="space-y-2">
              {[
                { type: 'script-creation', label: 'Script Creation' },
                { type: 'video-production', label: 'Video Production' },
                { type: 'review', label: 'Review Session' },
                { type: 'campaign-launch', label: 'Campaign Launch' },
                { type: 'meeting', label: 'Team Meeting' }
              ].map((item) => (
                <div key={item.type} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border ${getEventTypeColor(item.type as CalendarEvent['type'])}`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="script-creation">Script Creation</option>
                  <option value="video-production">Video Production</option>
                  <option value="review">Review Session</option>
                  <option value="campaign-launch">Campaign Launch</option>
                  <option value="meeting">Team Meeting</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="emma">Emma Davis</option>
                  <option value="mike">Mike Chen</option>
                  <option value="sarah">Sarah Johnson</option>
                  <option value="alex">Alex Rodriguez</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Create Event
                </button>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;