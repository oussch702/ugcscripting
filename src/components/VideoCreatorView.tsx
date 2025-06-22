import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload, 
  Scissors, 
  Type, 
  Music, 
  Image as ImageIcon,
  Settings,
  Save,
  Share2,
  Layers,
  Clock,
  Zap
} from 'lucide-react';

const VideoCreatorView: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoTemplates = [
    {
      id: '1',
      name: 'Problem-Solution Hook',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      duration: '15s',
      style: 'Modern',
      description: 'Start with a problem, reveal your solution'
    },
    {
      id: '2',
      name: 'Social Proof Opener',
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      duration: '15s',
      style: 'Professional',
      description: 'Lead with testimonials and success stories'
    },
    {
      id: '3',
      name: 'Feature Demo',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      duration: '20s',
      style: 'Clean',
      description: 'Showcase key features with real use cases'
    },
    {
      id: '4',
      name: 'Before & After',
      thumbnail: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      duration: '18s',
      style: 'Dynamic',
      description: 'Show transformation and results'
    }
  ];

  const quickActions = [
    { icon: Upload, label: 'Upload Media', color: 'bg-blue-500' },
    { icon: Type, label: 'Add Text', color: 'bg-green-500' },
    { icon: Music, label: 'Add Audio', color: 'bg-purple-500' },
    { icon: ImageIcon, label: 'Add Image', color: 'bg-orange-500' },
    { icon: Scissors, label: 'Trim Video', color: 'bg-red-500' },
    { icon: Layers, label: 'Add Layer', color: 'bg-indigo-500' }
  ];

  const recentProjects = [
    {
      id: '1',
      name: 'CloudSync Pro - Hook 1',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=100&dpr=2',
      lastEdited: '2 hours ago',
      duration: '15s',
      status: 'In Progress'
    },
    {
      id: '2',
      name: 'FitTracker - Social Proof',
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=100&dpr=2',
      lastEdited: '1 day ago',
      duration: '12s',
      status: 'Completed'
    },
    {
      id: '3',
      name: 'E-commerce Demo',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=100&dpr=2',
      lastEdited: '3 days ago',
      duration: '20s',
      status: 'Draft'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">🎬 Video Creator</h1>
        <p className="text-gray-600">Create and edit videos with AI assistance</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Templates */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🎨 Video Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="relative mb-3">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {template.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {template.style}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Video Generator */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              🤖 AI Video Generator
            </h2>
            <p className="text-gray-600 mb-4">
              Generate a complete video from your script using AI. Just paste your script and let our AI create the visuals, timing, and effects.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste Your Script</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                  placeholder="Paste your video script here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Style</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Modern & Clean</option>
                    <option>Professional</option>
                    <option>Dynamic & Energetic</option>
                    <option>Minimal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>15 seconds</option>
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-medium">
                Generate Video with AI ✨
              </button>
            </div>
          </div>
        </div>

        {/* Recent Projects & Tools */}
        <div className="space-y-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📁 Recent Projects</h2>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{project.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{project.lastEdited}</span>
                      <span>•</span>
                      <span>{project.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Projects
            </button>
          </div>

          {/* Video Editor Tools */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🛠️ Editor Tools</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Video Editor</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Type className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Text Animator</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Music className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">Audio Mixer</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Export Settings</span>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📤 Export & Share</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCreatorView;