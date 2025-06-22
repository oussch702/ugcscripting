export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
          job_title: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          job_title?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          job_title?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'owner' | 'creative-director' | 'creator' | 'viewer';
          created_at: string;
          updated_at: string;
          onboarding_completed: boolean;
          team_id: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'owner' | 'creative-director' | 'creator' | 'viewer';
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          team_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'owner' | 'creative-director' | 'creator' | 'viewer';
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          team_id?: string | null;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
          subscription_status: 'trial' | 'active' | 'cancelled' | 'past_due';
          max_members: number;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
          subscription_status?: 'trial' | 'active' | 'cancelled' | 'past_due';
          max_members?: number;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
          subscription_status?: 'trial' | 'active' | 'cancelled' | 'past_due';
          max_members?: number;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'owner' | 'creative-director' | 'creator' | 'viewer';
          permissions: ('view' | 'edit' | 'approve' | 'manage-team')[];
          invited_by: string | null;
          invited_at: string;
          joined_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role: 'owner' | 'creative-director' | 'creator' | 'viewer';
          permissions?: ('view' | 'edit' | 'approve' | 'manage-team')[];
          invited_by?: string | null;
          invited_at?: string;
          joined_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: 'owner' | 'creative-director' | 'creator' | 'viewer';
          permissions?: ('view' | 'edit' | 'approve' | 'manage-team')[];
          invited_by?: string | null;
          invited_at?: string;
          joined_at?: string | null;
          is_active?: boolean;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          team_id: string | null;
          product_data: any;
          audience_data: any;
          status: 'active' | 'completed' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          team_id?: string | null;
          product_data?: any;
          audience_data?: any;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string;
          team_id?: string | null;
          product_data?: any;
          audience_data?: any;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      project_collaborators: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'owner' | 'creative-director' | 'creator' | 'viewer';
          permissions: ('view' | 'edit' | 'approve' | 'manage-team')[];
          added_by: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role: 'owner' | 'creative-director' | 'creator' | 'viewer';
          permissions?: ('view' | 'edit' | 'approve' | 'manage-team')[];
          added_by?: string | null;
          added_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: 'owner' | 'creative-director' | 'creator' | 'viewer';
          permissions?: ('view' | 'edit' | 'approve' | 'manage-team')[];
          added_by?: string | null;
          added_at?: string;
        };
      };
      scripts: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          concept: string;
          content: any;
          status: 'draft' | 'ready-for-review' | 'changes-requested' | 'approved' | 'rejected';
          created_by: string;
          assigned_to: string | null;
          reviewer_id: string | null;
          performance_data: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          concept: string;
          content?: any;
          status?: 'draft' | 'ready-for-review' | 'changes-requested' | 'approved' | 'rejected';
          created_by: string;
          assigned_to?: string | null;
          reviewer_id?: string | null;
          performance_data?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          concept?: string;
          content?: any;
          status?: 'draft' | 'ready-for-review' | 'changes-requested' | 'approved' | 'rejected';
          created_by?: string;
          assigned_to?: string | null;
          reviewer_id?: string | null;
          performance_data?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      script_comments: {
        Row: {
          id: string;
          script_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          line_number: number | null;
          is_resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          script_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          line_number?: number | null;
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          script_id?: string;
          user_id?: string;
          parent_id?: string | null;
          content?: string;
          line_number?: number | null;
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      script_versions: {
        Row: {
          id: string;
          script_id: string;
          version_number: number;
          title: string;
          content: any;
          changes_summary: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          script_id: string;
          version_number: number;
          title: string;
          content: any;
          changes_summary?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          script_id?: string;
          version_number?: number;
          title?: string;
          content?: any;
          changes_summary?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'script-submitted' | 'changes-requested' | 'script-approved' | 'project-assigned' | 'mention';
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'script-submitted' | 'changes-requested' | 'script-approved' | 'project-assigned' | 'mention';
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'script-submitted' | 'changes-requested' | 'script-approved' | 'project-assigned' | 'mention';
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };
      performance_data: {
        Row: {
          id: string;
          script_id: string;
          user_id: string;
          actual_ctr: number | null;
          actual_cvr: number | null;
          rating: number | null;
          feedback: string | null;
          insights: string | null;
          campaign_name: string | null;
          ad_spend: number | null;
          impressions: number | null;
          clicks: number | null;
          conversions: number | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          script_id: string;
          user_id: string;
          actual_ctr?: number | null;
          actual_cvr?: number | null;
          rating?: number | null;
          feedback?: string | null;
          insights?: string | null;
          campaign_name?: string | null;
          ad_spend?: number | null;
          impressions?: number | null;
          clicks?: number | null;
          conversions?: number | null;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          script_id?: string;
          user_id?: string;
          actual_ctr?: number | null;
          actual_cvr?: number | null;
          rating?: number | null;
          feedback?: string | null;
          insights?: string | null;
          campaign_name?: string | null;
          ad_spend?: number | null;
          impressions?: number | null;
          clicks?: number | null;
          conversions?: number | null;
          recorded_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'owner' | 'creative-director' | 'creator' | 'viewer';
      project_status: 'active' | 'completed' | 'archived';
      script_status: 'draft' | 'ready-for-review' | 'changes-requested' | 'approved' | 'rejected';
      subscription_status: 'trial' | 'active' | 'cancelled' | 'past_due';
      notification_type: 'script-submitted' | 'changes-requested' | 'script-approved' | 'project-assigned' | 'mention';
      permission_type: 'view' | 'edit' | 'approve' | 'manage-team';
    };
  };
}