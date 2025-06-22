import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  Target,
  Award,
  Lightbulb,
  Plus
} from 'lucide-react';

const PerformanceView: React.FC = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    scriptId: '',
    ctr: '',
    cvr: '',
    rating: 0,
    feedback: '',
    insights: ''
  });

  const mockPerformanceData = {
    totalScripts: 24,
    scriptsTested: 18,
    winnersFound: 7,
    successRate: 39,
    topPerformers: [
      {
        id: '1',
        concept: 'Problem-Solution Hook',
        ctr: 8.3,
        cvr: 4.1,
        rating: 5,
        campaign: 'CloudSync Pro'
      },
      {
        id: '2',
        concept: 'Social Proof Opener',
        ctr: 7.8,
        cvr: 3.9,
        rating: 4,
        campaign: 'FitTracker App'
      },
      {
        id: '3',
        concept: 'Feature Demo Focus',
        ctr: 7.2,
        cvr: 3.7,
        rating: 4,
        campaign: 'CloudSync Pro'
      }
    ],
    insights: [
      "Your audience responds best to problem-focused hooks",
      "Try more testimonial-based openings",
      "Your winning CTAs typically use urgency language"
    ]
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedbackData);
    setShowFeedbackForm(false);
    setFeedbackData({
      scriptId: '',
      ctr: '',
      cvr: '',
      rating: 0,
      feedback: '',
      insights: ''
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">📈 Performance Insights</h1>
        <p className="text-gray-600">Track your script performance and discover winning patterns</p>
      </div>

      {/* Campaign Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Your Campaign Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{mockPerformanceData.totalScripts}</div>
            <div className="text-sm text-gray-600">Total Scripts Created</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-green-600">{mockPerformanceData.scriptsTested}</div>
            <div className="text-sm text-gray-600">Scripts Tested</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-orange-600">{mockPerformanceData.winnersFound}</div>
            <div className="text-sm text-gray-600">Winners Found</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">{mockPerformanceData.successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Performance Input Form */}
      {showFeedbackForm && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Script Performance Input</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How did this script perform?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">CTR (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={feedbackData.ctr}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, ctr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 8.3"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">CVR (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={feedbackData.cvr}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, cvr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4.1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 ${star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Feedback</label>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Winner</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Loser</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>Testing</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What worked well?</label>
                <textarea
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  placeholder="Share what resonated with your audience..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audience Insights</label>
                <textarea
                  value={feedbackData.insights}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, insights: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  placeholder="Any insights about your audience behavior..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitFeedback}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Performance Data Button */}
      {!showFeedbackForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Performance Data</span>
          </button>
        </div>
      )}

      {/* Top Performing Scripts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          🏆 Top Performing Scripts
        </h2>
        <div className="space-y-4">
          {mockPerformanceData.topPerformers.map((script, index) => (
            <div key={script.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">#{index + 1} {script.concept}</h3>
                <div className="flex items-center space-x-1">
                  {[...Array(script.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">Campaign: {script.campaign}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">CTR:</span> {script.ctr}%
                </div>
                <div>
                  <span className="font-medium">CVR:</span> {script.cvr}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
          📋 Learning Insights
        </h2>
        <div className="space-y-3">
          {mockPerformanceData.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceView;