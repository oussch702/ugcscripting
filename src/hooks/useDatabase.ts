import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Team = Tables['teams']['Row'];
type TeamMember = Tables['team_members']['Row'];
type Project = Tables['projects']['Row'];
type Script = Tables['scripts']['Row'];
type ScriptComment = Tables['script_comments']['Row'];
type Notification = Tables['notifications']['Row'];
type PerformanceData = Tables['performance_data']['Row'];

export const useDatabase = () => {
  const { user } = useAuth();

  // Profile operations
  const getProfile = async (userId?: string): Promise<Profile | null> => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: any }> => {
    if (!user?.id) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    return { error };
  };

  // Team operations
  const createTeam = async (name: string): Promise<{ data: Team | null; error: any }> => {
    if (!user?.id) return { data: null, error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name,
        owner_id: user.id
      })
      .select()
      .single();

    if (!error && data) {
      // Add owner as team member
      await supabase
        .from('team_members')
        .insert({
          team_id: data.id,
          user_id: user.id,
          role: 'owner',
          permissions: ['view', 'edit', 'approve', 'manage-team'],
          joined_at: new Date().toISOString()
        });

      // Update user's team_id
      await supabase
        .from('users')
        .update({ team_id: data.id })
        .eq('id', user.id);
    }

    return { data, error };
  };

  const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url, role),
        profile:profiles(first_name, last_name, company_name, job_title)
      `)
      .eq('team_id', teamId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  };

  const inviteTeamMember = async (
    teamId: string, 
    email: string, 
    role: Database['public']['Enums']['user_role']
  ): Promise<{ error: any }> => {
    if (!user?.id) return { error: new Error('No user logged in') };

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Add existing user to team
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: existingUser.id,
          role,
          permissions: role === 'owner' ? ['view', 'edit', 'approve', 'manage-team'] :
                      role === 'creative-director' ? ['view', 'edit', 'approve'] :
                      role === 'creator' ? ['view', 'edit'] : ['view'],
          invited_by: user.id,
          joined_at: new Date().toISOString()
        });

      if (!error) {
        // Update user's team_id
        await supabase
          .from('users')
          .update({ team_id: teamId })
          .eq('id', existingUser.id);

        // Send notification
        await supabase.rpc('create_notification', {
          recipient_id: existingUser.id,
          notification_type: 'project-assigned',
          title: 'Team Invitation',
          message: `You've been added to a team with ${role} role`,
          sender_id: user.id
        });
      }

      return { error };
    } else {
      // TODO: Send email invitation for new users
      return { error: new Error('User not found. Email invitations not yet implemented.') };
    }
  };

  // Project operations
  const createProject = async (
    name: string, 
    description?: string,
    productData?: any,
    audienceData?: any
  ): Promise<{ data: Project | null; error: any }> => {
    if (!user?.id) return { data: null, error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        owner_id: user.id,
        product_data: productData || {},
        audience_data: audienceData || {}
      })
      .select()
      .single();

    return { data, error };
  };

  const getProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  };

  const updateProject = async (
    projectId: string, 
    updates: Partial<Project>
  ): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);

    return { error };
  };

  // Script operations
  const createScript = async (
    projectId: string,
    title: string,
    concept: string,
    content: any
  ): Promise<{ data: Script | null; error: any }> => {
    if (!user?.id) return { data: null, error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('scripts')
      .insert({
        project_id: projectId,
        title,
        concept,
        content,
        created_by: user.id
      })
      .select()
      .single();

    if (!error && data) {
      // Create initial version
      await supabase
        .from('script_versions')
        .insert({
          script_id: data.id,
          version_number: 1,
          title,
          content,
          changes_summary: 'Initial version',
          created_by: user.id
        });
    }

    return { data, error };
  };

  const getScripts = async (projectId?: string): Promise<Script[]> => {
    let query = supabase
      .from('scripts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching scripts:', error);
      return [];
    }

    return data || [];
  };

  const updateScript = async (
    scriptId: string,
    updates: Partial<Script>
  ): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', scriptId);

    return { error };
  };

  // Comment operations
  const getScriptComments = async (scriptId: string): Promise<ScriptComment[]> => {
    const { data, error } = await supabase
      .from('script_comments')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url),
        profile:profiles(first_name, last_name)
      `)
      .eq('script_id', scriptId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching script comments:', error);
      return [];
    }

    return data || [];
  };

  const createScriptComment = async (
    scriptId: string,
    content: string,
    lineNumber?: number,
    parentId?: string
  ): Promise<{ data: ScriptComment | null; error: any }> => {
    if (!user?.id) return { data: null, error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('script_comments')
      .insert({
        script_id: scriptId,
        user_id: user.id,
        content,
        line_number: lineNumber,
        parent_id: parentId
      })
      .select()
      .single();

    return { data, error };
  };

  // Notification operations
  const getNotifications = async (): Promise<Notification[]> => {
    if (!user?.id) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  };

  const markNotificationAsRead = async (notificationId: string): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    return { error };
  };

  // Performance data operations
  const createPerformanceData = async (
    scriptId: string,
    performanceData: Partial<PerformanceData>
  ): Promise<{ data: PerformanceData | null; error: any }> => {
    if (!user?.id) return { data: null, error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('performance_data')
      .insert({
        script_id: scriptId,
        user_id: user.id,
        ...performanceData
      })
      .select()
      .single();

    return { data, error };
  };

  const getPerformanceData = async (scriptId?: string): Promise<PerformanceData[]> => {
    let query = supabase
      .from('performance_data')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (scriptId) {
      query = query.eq('script_id', scriptId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching performance data:', error);
      return [];
    }

    return data || [];
  };

  return {
    // Profile operations
    getProfile,
    updateProfile,
    
    // Team operations
    createTeam,
    getTeamMembers,
    inviteTeamMember,
    
    // Project operations
    createProject,
    getProjects,
    updateProject,
    
    // Script operations
    createScript,
    getScripts,
    updateScript,
    
    // Comment operations
    getScriptComments,
    createScriptComment,
    
    // Notification operations
    getNotifications,
    markNotificationAsRead,
    
    // Performance operations
    createPerformanceData,
    getPerformanceData
  };
};