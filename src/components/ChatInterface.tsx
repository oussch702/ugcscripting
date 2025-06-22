import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Menu, LogOut } from 'lucide-react';
import { ViewType, Message, AnalysisData } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import Sidebar from './Sidebar';
import PerformanceView from './PerformanceView';
import TeamView from './TeamView';
import ScriptsView from './ScriptsView';
import VideoCreatorView from './VideoCreatorView';
import AnalyticsView from './AnalyticsView';
import CalendarView from './CalendarView';

// Import icons for workflow steps
import { 
  Brain,
  Film,
  TrendingUp,
  BarChart3,
  Edit3,
  FileText,
  Target,
  Video,
  Users,
  Calendar
} from 'lucide-react';

const ChatInterface = () => {
  const { user, userProfile, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [workflowStep, setWorkflowStep] = useState<'initial' | 'processing' | 'results' | 'strategy-processing' | 'strategy-results' | 'script-processing' | 'script-results'>('initial');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingAnalysis, setEditingAnalysis] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { projects, currentProject, setCurrentProject, createProject, getProjectHistory } = useProjects();
  
  const [analysisData, setAnalysisData] = useState({
    product: {
      name: 'CloudSync Pro',
      description: 'Advanced cloud storage solution for teams',
      vertical: 'SaaS/Productivity',
      voice: 'Professional, trustworthy',
      usp: ['End-to-end encryption', 'Real-time collaboration', '99.9% uptime'],
      cta: 'Start free trial'
    },
    audience: {
      demographics: '25-45, business professionals, tech-savvy',
      painPoints: ['Data security concerns', 'Team collaboration challenges', 'File version conflicts'],
      motivations: ['Efficiency', 'Security', 'Seamless teamwork']
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: "Hi! I'm your MindCue AI agent. I'll help you create winning video strategies and scripts.\n\nTo get started, just share your product's landing page URL and I'll analyze everything for you.\n\nWhat's your product page?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Check if it's a URL
    if (isValidURL(userInput)) {
      // Simulate URL processing
      setTimeout(() => {
        setWorkflowStep('processing');
        setIsLoading(false);
      }, 1000);

      // Simulate analysis completion
      setTimeout(() => {
        setWorkflowStep('results');
      }, 5000);
    } else {
      // Handle conversational responses
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'd love to help! Could you share your product's landing page URL? This helps me analyze your product details and target audience to create the best video strategies for you.\n\nJust paste the URL here and I'll get started! 🚀",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleConfirmAnalysis = () => {
    // Create new project with analysis data
    const projectName = `${analysisData.product.name} Campaign`;
    createProject(projectName, analysisData);
    
    setWorkflowStep('strategy-processing');
    setTimeout(() => {
      setWorkflowStep('strategy-results');
    }, 4000);
  };

  const handleEditAnalysis = () => {
    setEditingAnalysis(true);
  };

  const handleSaveAnalysis = () => {
    setEditingAnalysis(false);
  };

  const handleStartOver = () => {
    setWorkflowStep('initial');
    setMessages([{
      id: Date.now().toString(),
      text: "No problem! Let's start fresh. Share your product's landing page URL and I'll analyze it for you.\n\nWhat's your product page?",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  const handleCreateScripts = () => {
    setWorkflowStep('script-processing');
    setTimeout(() => {
      setWorkflowStep('script-results');
    }, 6000);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      setAnalysisData(project.analysisData);
      setCurrentView('chat');
      // Reset workflow to show completed state
      setWorkflowStep('script-results');
    }
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setWorkflowStep('initial');
    setMessages([{
      id: Date.now().toString(),
      text: "Hi! I'm your MindCue AI agent. I'll help you create winning video strategies and scripts.\n\nTo get started, just share your product's landing page URL and I'll analyze everything for you.\n\nWhat's your product page?",
      isUser: false,
      timestamp: new Date()
    }]);
    setCurrentView('chat');
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const renderProcessingSteps = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100 animate-fadeIn">
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm md:text-base text-gray-700">🔍 Analyzing your landing page...</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <span className="text-sm md:text-base text-gray-700">📊 Extracting product details...</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <span className="text-sm md:text-base text-gray-700">🎯 Identifying your target audience...</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
          <span className="text-sm md:text-base text-gray-700">✨ Almost done...</span>
        </div>
      </div>
    </div>
  );

  const renderAnalysisResults = () => (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-100 animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">📋 PRODUCT ANALYSIS COMPLETE</h3>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div>
          <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">🏷️ Product Details:</h4>
          <div className="space-y-2 text-sm md:text-base text-gray-700 ml-2 md:ml-4">
            {editingAnalysis ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                  <input
                    type="text"
                    value={analysisData.product.name}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      product: { ...prev.product, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                  <textarea
                    value={analysisData.product.description}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      product: { ...prev.product, description: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vertical:</label>
                  <input
                    type="text"
                    value={analysisData.product.vertical}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      product: { ...prev.product, vertical: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Voice:</label>
                  <input
                    type="text"
                    value={analysisData.product.voice}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      product: { ...prev.product, voice: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action:</label>
                  <input
                    type="text"
                    value={analysisData.product.cta}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      product: { ...prev.product, cta: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div><strong>Name:</strong> {analysisData.product.name}</div>
                <div><strong>Description:</strong> {analysisData.product.description}</div>
                <div><strong>Vertical:</strong> {analysisData.product.vertical}</div>
                <div><strong>Primary Voice:</strong> {analysisData.product.voice}</div>
                <div><strong>Unique Selling Points:</strong> {analysisData.product.usp.join(', ')}</div>
                <div><strong>Call to Action:</strong> {analysisData.product.cta}</div>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">🎯 Target Audience:</h4>
          <div className="space-y-2 text-sm md:text-base text-gray-700 ml-2 md:ml-4">
            {editingAnalysis ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Demographics:</label>
                  <input
                    type="text"
                    value={analysisData.audience.demographics}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      audience: { ...prev.audience, demographics: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div><strong>Primary Demographics:</strong> {analysisData.audience.demographics}</div>
                <div><strong>Pain Points:</strong> {analysisData.audience.painPoints.join(', ')}</div>
                <div><strong>Motivations:</strong> {analysisData.audience.motivations.join(', ')}</div>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-green-200">
          <p className="text-sm md:text-base text-gray-700 mb-4">✅ Does this look accurate?</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {editingAnalysis ? (
              <>
                <button 
                  onClick={handleSaveAnalysis}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Save changes ✓
                </button>
                <button 
                  onClick={() => setEditingAnalysis(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleConfirmAnalysis}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Confirm and continue →
                </button>
                <button 
                  onClick={handleEditAnalysis}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Edit details ✏️
                </button>
                <button 
                  onClick={handleStartOver}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Start over 🔄
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStrategyProcessing = () => (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-100 animate-fadeIn">
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center space-x-3">
          <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
          <span className="text-sm md:text-base text-gray-700">🧠 Creating your video strategy...</span>
        </div>
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-purple-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="text-sm md:text-base text-gray-700">📈 Analyzing market trends...</span>
        </div>
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 text-purple-600 animate-pulse" style={{ animationDelay: '1s' }} />
          <span className="text-sm md:text-base text-gray-700">🎬 Developing winning concepts...</span>
        </div>
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-green-600 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <span className="text-sm md:text-base text-gray-700">📊 Calculating expected performance...</span>
        </div>
      </div>
    </div>
  );

  const renderStrategyResults = () => (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 md:p-6 border border-orange-100 animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">🎯 VIDEO STRATEGY & CONCEPTS</h3>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-600">85/100</div>
            <div className="text-xs md:text-sm text-gray-600">Creative Health Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">12</div>
            <div className="text-xs md:text-sm text-gray-600">Weekly Videos</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600">$25K</div>
            <div className="text-xs md:text-sm text-gray-600">Est. Ad Spend</div>
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">🎬 TOP PERFORMING CONCEPTS:</h4>
          
          <div className="space-y-3 md:space-y-4">
            {[
              {
                name: "Problem-Solution Hook",
                hook: "Start with customer pain point, reveal solution",
                ctr: "8.3%",
                cvr: "4.1%",
                fit: "9/10"
              },
              {
                name: "Social Proof Opener",
                hook: "Lead with testimonials and success stories",
                ctr: "7.8%",
                cvr: "3.9%",
                fit: "8/10"
              },
              {
                name: "Feature Demo Focus",
                hook: "Showcase key features with real use cases",
                ctr: "7.2%",
                cvr: "3.7%",
                fit: "8/10"
              }
            ].map((concept, index) => (
              <div key={index} className="bg-white p-3 md:p-4 rounded-lg border">
                <h5 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Concept {index + 1}: {concept.name}</h5>
                <div className="space-y-1 text-xs md:text-sm text-gray-600">
                  <div><strong>Hook Strategy:</strong> {concept.hook}</div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div><strong>Expected CTR:</strong> {concept.ctr}</div>
                    <div><strong>Expected CVR:</strong> {concept.cvr}</div>
                    <div><strong>Audience Fit:</strong> {concept.fit}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-orange-200">
          <p className="text-sm md:text-base text-gray-700 mb-4">🚀 Ready to create scripts for these concepts?</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={handleCreateScripts}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
            >
              Yes, create scripts →
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base">
              Modify strategy ✏️
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base">
              See more concepts 📋
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScriptProcessing = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 md:p-6 border border-indigo-100 animate-fadeIn">
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center space-x-3">
          <Edit3 className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span className="text-sm md:text-base text-gray-700">✍️ Writing your video scripts...</span>
        </div>
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 text-indigo-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="text-sm md:text-base text-gray-700">🎬 Creating scene descriptions...</span>
        </div>
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-indigo-600 animate-pulse" style={{ animationDelay: '1s' }} />
          <span className="text-sm md:text-base text-gray-700">🎭 Optimizing for your audience...</span>
        </div>
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-green-600 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <span className="text-sm md:text-base text-gray-700">📝 Adding production notes...</span>
        </div>
      </div>
    </div>
  );

  const renderScriptResults = () => (
    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 md:p-6 border border-teal-100 animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">📝 YOUR VIDEO SCRIPTS ARE READY!</h3>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {[
          {
            concept: "Problem-Solution Hook",
            target: "Business professionals with data security concerns",
            duration: "15 seconds",
            ctr: "8.3%",
            cvr: "4.1%",
            scenes: [
              {
                timeframe: "Hook - 0-3 seconds",
                scene: "Close-up of frustrated person at computer with error message",
                text: "Tired of losing important files to crashes?"
              },
              {
                timeframe: "Value Prop - 4-10 seconds", 
                scene: "Smooth transition to CloudSync interface showing real-time sync",
                text: "CloudSync Pro keeps your team's work safe with instant backup and 99.9% uptime."
              },
              {
                timeframe: "CTA - 11-15 seconds",
                scene: "Happy team collaborating with files syncing seamlessly",
                text: "Start your free trial today and never lose work again!"
              }
            ],
            notes: [
              "Use contrasting lighting (dark/frustrated vs bright/solution)",
              "Props needed: Multiple devices, team workspace setup",
              "Key visual: Sync animation should be smooth and obvious"
            ]
          },
          {
            concept: "Social Proof Opener",
            target: "Business professionals seeking reliable solutions",
            duration: "15 seconds",
            ctr: "7.8%",
            cvr: "3.9%",
            scenes: [
              {
                timeframe: "Hook - 0-3 seconds",
                scene: "Montage of happy customers with testimonial quotes",
                text: "Over 50,000 teams trust CloudSync Pro"
              },
              {
                timeframe: "Value Prop - 4-10 seconds", 
                scene: "Real customer testimonial with product demo overlay",
                text: "See why companies choose us for secure, reliable file sharing"
              },
              {
                timeframe: "CTA - 11-15 seconds",
                scene: "Call-to-action with customer logos in background",
                text: "Join thousands of satisfied customers - start free!"
              }
            ],
            notes: [
              "Use real customer testimonials if available",
              "Include recognizable company logos",
              "Maintain professional, trustworthy tone throughout"
            ]
          }
        ].map((script, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-lg border">
            <div className="mb-4">
              <h4 className="text-base md:text-lg font-semibold text-gray-800">Script {index + 1}: {script.concept}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2 text-xs md:text-sm text-gray-600">
                <div><strong>🎯 Target:</strong> {script.target}</div>
                <div><strong>⏱️ Duration:</strong> {script.duration}</div>
                <div><strong>📈 CTR:</strong> {script.ctr}</div>
                <div><strong>📊 CVR:</strong> {script.cvr}</div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">🎬 SCRIPT:</h5>
              <div className="space-y-3 md:space-y-4">
                {script.scenes.map((scene, sceneIndex) => (
                  <div key={sceneIndex} className="border-l-4 border-teal-400 pl-4">
                    <div className="font-medium text-teal-700 text-sm md:text-base">[{scene.timeframe}]</div>
                    <div className="text-sm text-gray-600 mt-1"><strong>Scene:</strong> {scene.scene}</div>
                    <div className="text-sm md:text-base text-gray-800 mt-1"><strong>Text/Voiceover:</strong> "{scene.text}"</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">📋 Production Notes:</h5>
              <ul className="space-y-1 text-xs md:text-sm text-gray-600">
                {script.notes.map((note, noteIndex) => (
                  <li key={noteIndex}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-teal-200">
          <p className="text-sm md:text-base text-gray-700 mb-4">✅ What would you like to do?</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-xs md:text-sm">
              Approve all scripts ✓
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-xs md:text-sm">
              Edit scripts ✏️
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-xs md:text-sm">
              Request new versions 🔄
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-xs md:text-sm">
              Save to history 💾
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowContent = () => {
    switch (workflowStep) {
      case 'processing':
        return renderProcessingSteps();
      case 'results':
        return renderAnalysisResults();
      case 'strategy-processing':
        return renderStrategyProcessing();
      case 'strategy-results':
        return renderStrategyResults();
      case 'script-processing':
        return renderScriptProcessing();
      case 'script-results':
        return renderScriptResults();
      default:
        return null;
    }
  };

  const renderChatView = () => (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-600 text-white ml-4'
                  : 'bg-gray-100 text-gray-800 mr-4'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm md:text-base">{message.text}</div>
              <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Workflow Content */}
        {workflowStep !== 'initial' && (
          <div className="animate-fadeIn">
            {renderWorkflowContent()}
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl mr-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2 md:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Enter your product URL or ask me anything..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors duration-200 touch-manipulation"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return renderChatView();
      case 'performance':
        return <PerformanceView />;
      case 'team':
        return <TeamView />;
      case 'video-creator':
        return <VideoCreatorView />;
      case 'scripts':
        return <ScriptsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return renderChatView();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebarCollapse={toggleSidebarCollapse}
        projectHistory={getProjectHistory()}
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                  {currentView === 'chat' ? 'AI Chat' : 
                   currentView === 'performance' ? 'Performance' :
                   currentView === 'team' ? 'Team' :
                   currentView === 'video-creator' ? 'Video Creator' :
                   currentView === 'scripts' ? 'Scripts' :
                   currentView === 'analytics' ? 'Analytics' :
                   currentView === 'calendar' ? 'Calendar' : 'MindCue AI'}
                </h1>
                <p className="text-xs md:text-sm text-gray-500">AI-powered video strategy and script generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                {userProfile && (
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {userProfile.full_name || user?.email}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {userProfile.role.replace('-', ' ')}
                      </div>
                    </div>
                    {userProfile.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(userProfile.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 touch-manipulation"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 touch-manipulation">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;