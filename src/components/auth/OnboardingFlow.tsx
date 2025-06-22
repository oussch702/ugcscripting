import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Users, Zap, Target, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [teamName, setTeamName] = useState('');
  const { updateProfile } = useAuth();

  const steps = [
    {
      title: 'Welcome to MindCue! 🎉',
      subtitle: 'Let\'s get you set up in under 60 seconds',
      component: 'welcome'
    },
    {
      title: 'What\'s your role?',
      subtitle: 'This helps us customize your experience',
      component: 'role'
    },
    {
      title: 'What are your main goals?',
      subtitle: 'Select all that apply',
      component: 'goals'
    },
    {
      title: 'Create your workspace',
      subtitle: 'You can invite team members later',
      component: 'workspace'
    }
  ];

  const roles = [
    {
      id: 'owner',
      title: 'Business Owner',
      description: 'I run the business and need winning video strategies',
      icon: Target
    },
    {
      id: 'creative-director',
      title: 'Creative Director',
      description: 'I oversee creative strategy and team output',
      icon: Users
    },
    {
      id: 'creator',
      title: 'Content Creator',
      description: 'I create videos and need better scripts',
      icon: Zap
    },
    {
      id: 'viewer',
      title: 'Team Member',
      description: 'I review and provide feedback on content',
      icon: BarChart3
    }
  ];

  const goals = [
    'Increase video ad performance',
    'Create more engaging content',
    'Scale video production',
    'Improve team collaboration',
    'Generate better scripts faster',
    'Track performance and optimize'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    await updateProfile({
      role: selectedRole as any,
      onboarding_completed: true
    });
    
    // The auth context will automatically update and redirect to main app
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return selectedRole !== '';
      case 2: return selectedGoals.length > 0;
      case 3: return teamName.trim() !== '';
      default: return false;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">AI-powered video strategy creation</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">High-converting script generation</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Performance tracking and optimization</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Team collaboration tools</span>
              </div>
            </div>
          </div>
        );

      case 'role':
        return (
          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <role.icon className={`w-6 h-6 mt-1 ${
                    selectedRole === role.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-gray-800">{role.title}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-3">
            {goals.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                  selectedGoals.includes(goal)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedGoals.includes(goal)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedGoals.includes(goal) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-800">{goal}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'workspace':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Acme Marketing Team"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">What's next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Start with your first video strategy</li>
                <li>• Invite team members to collaborate</li>
                <li>• Track performance and optimize</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 mb-6">
            {steps[currentStep].subtitle}
          </p>
          
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;