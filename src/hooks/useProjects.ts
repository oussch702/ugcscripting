import { useState, useEffect } from 'react';
import { Project, Script, AnalysisData } from '../types';

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'CloudSync Pro Campaign',
    analysisData: {
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
    },
    scripts: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    collaborators: [],
    owner: 'current-user'
  },
  {
    id: '2',
    name: 'FitTracker App Launch',
    analysisData: {
      product: {
        name: 'FitTracker Pro',
        description: 'AI-powered fitness tracking app',
        vertical: 'Health & Fitness',
        voice: 'Motivational, energetic',
        usp: ['AI workout plans', 'Real-time form correction', 'Social challenges'],
        cta: 'Download free'
      },
      audience: {
        demographics: '18-35, fitness enthusiasts, tech-savvy',
        painPoints: ['Lack of motivation', 'Poor form', 'Boring workouts'],
        motivations: ['Health goals', 'Social connection', 'Progress tracking']
      }
    },
    scripts: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    status: 'completed',
    collaborators: [],
    owner: 'current-user'
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const createProject = (name: string, analysisData: AnalysisData): Project => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      analysisData,
      scripts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      collaborators: [],
      owner: 'current-user'
    };

    setProjects(prev => [newProject, ...prev]);
    setCurrentProject(newProject);
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));

    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const addScriptToProject = (projectId: string, script: Script) => {
    updateProject(projectId, {
      scripts: [...(projects.find(p => p.id === projectId)?.scripts || []), script]
    });
  };

  const getProjectHistory = () => {
    return projects.map(project => ({
      id: project.id,
      name: project.analysisData.product.name,
      date: project.createdAt,
      scriptCount: project.scripts.length
    }));
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    addScriptToProject,
    getProjectHistory
  };
};