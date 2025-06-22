export type ViewType = 'chat' | 'analytics' | 'team' | 'video-creator' | 'scripts' | 'calendar' | 'performance';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ProductDetails {
  name: string;
  description: string;
  vertical: string;
  voice: string;
  usp: string[];
  cta: string;
}

export interface AudienceDetails {
  demographics: string;
  painPoints: string[];
  motivations: string[];
}

export interface AnalysisData {
  product: ProductDetails;
  audience: AudienceDetails;
}

export interface Script {
  id: string;
  conceptName: string;
  target: string;
  duration: string;
  ctr: string;
  cvr: string;
  scenes: ScriptScene[];
  notes: string[];
  status: ScriptStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  reviewer?: string;
  comments: Comment[];
  version: number;
}

export interface ScriptScene {
  timeframe: string;
  scene: string;
  text: string;
}

export type ScriptStatus = 'draft' | 'ready-for-review' | 'changes-requested' | 'approved' | 'rejected';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies: Comment[];
}

export interface Project {
  id: string;
  name: string;
  analysisData: AnalysisData;
  scripts: Script[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';
  collaborators: ProjectCollaborator[];
  owner: string;
}

export interface ProjectCollaborator {
  userId: string;
  userName: string;
  role: UserRole;
  permissions: Permission[];
}

export type UserRole = 'owner' | 'creative-director' | 'creator' | 'viewer';

export type Permission = 'view' | 'edit' | 'approve' | 'manage-team';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export type NotificationType = 'script-submitted' | 'changes-requested' | 'script-approved' | 'project-assigned' | 'mention';

export interface PerformanceData {
  scriptId: string;
  actualCtr?: number;
  actualCvr?: number;
  rating: number;
  feedback: string;
  insights: string;
  timestamp: Date;
}