/*
  # Enhanced Team Collaboration and Project Management

  1. New Tables
    - `profiles` - Extended user profile information
    - `team_members` - Detailed team membership with permissions
    - `project_collaborators` - Project-specific collaboration
    - `script_comments` - Commenting system for scripts
    - `script_versions` - Version control for scripts
    - `notifications` - User notification system
    - `performance_data` - Script performance tracking

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for team-based access control
    - Implement role-based permissions (owner, creative-director, creator, viewer)

  3. Functions
    - Automatic profile creation on user signup
    - Notification creation helper
    - User permission checking functions
    - Project access validation

  4. Performance
    - Add indexes for optimal query performance
    - Triggers for automatic timestamp updates
*/

-- Create additional custom types (with error handling)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('script-submitted', 'changes-requested', 'script-approved', 'project-assigned', 'mention');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_type') THEN
        CREATE TYPE permission_type AS ENUM ('view', 'edit', 'approve', 'manage-team');
    END IF;
END $$;

-- Create profiles table (extends auth.users with additional info)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  company_name text,
  job_title text,
  avatar_url text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table for detailed team management
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  permissions permission_type[] DEFAULT ARRAY['view']::permission_type[],
  invited_by uuid REFERENCES users(id),
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  is_active boolean DEFAULT true,
  UNIQUE(team_id, user_id)
);

-- Create project_collaborators table for project-specific permissions
CREATE TABLE IF NOT EXISTS project_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  permissions permission_type[] DEFAULT ARRAY['view']::permission_type[],
  added_by uuid REFERENCES users(id),
  added_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create script_comments table for collaboration
CREATE TABLE IF NOT EXISTS script_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id uuid NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES script_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  line_number integer,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create script_versions table for version control
CREATE TABLE IF NOT EXISTS script_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id uuid NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL,
  changes_summary text,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(script_id, version_number)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  is_read boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create performance_data table for tracking script performance
CREATE TABLE IF NOT EXISTS performance_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id uuid NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  actual_ctr decimal(5,2),
  actual_cvr decimal(5,2),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  insights text,
  campaign_name text,
  ad_spend decimal(10,2),
  impressions integer,
  clicks integer,
  conversions integer,
  recorded_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_data ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Team members can view team profiles" ON profiles
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT u.id FROM users u
      JOIN users auth_user ON auth_user.id = auth.uid()
      WHERE u.team_id IS NOT NULL 
        AND u.team_id = auth_user.team_id
    )
  );

-- Team members policies
CREATE POLICY "Team owners can manage team members" ON team_members
  FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view team membership" ON team_members
  FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view own team membership" ON team_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Project collaborators policies
CREATE POLICY "Project owners can manage collaborators" ON project_collaborators
  FOR ALL TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Team leads can manage project collaborators" ON project_collaborators
  FOR ALL TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN users u ON u.id = auth.uid()
      WHERE p.team_id IS NOT NULL 
        AND p.team_id = u.team_id 
        AND u.role IN ('owner', 'creative-director')
    )
  );

CREATE POLICY "Project collaborators can view project team" ON project_collaborators
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    ) OR
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- Script comments policies
CREATE POLICY "Project team can view script comments" ON script_comments
  FOR SELECT TO authenticated
  USING (
    script_id IN (
      SELECT s.id FROM scripts s
      JOIN projects p ON p.id = s.project_id
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid()
         OR s.created_by = auth.uid()
         OR s.assigned_to = auth.uid()
         OR s.reviewer_id = auth.uid()
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id)
         OR EXISTS (
           SELECT 1 FROM project_collaborators pc 
           WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
         )
    )
  );

CREATE POLICY "Authorized users can create script comments" ON script_comments
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    script_id IN (
      SELECT s.id FROM scripts s
      JOIN projects p ON p.id = s.project_id
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid()
         OR s.created_by = auth.uid()
         OR s.assigned_to = auth.uid()
         OR s.reviewer_id = auth.uid()
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id)
         OR EXISTS (
           SELECT 1 FROM project_collaborators pc 
           WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
         )
    )
  );

CREATE POLICY "Comment authors can update their comments" ON script_comments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Script versions policies
CREATE POLICY "Project team can view script versions" ON script_versions
  FOR SELECT TO authenticated
  USING (
    script_id IN (
      SELECT s.id FROM scripts s
      JOIN projects p ON p.id = s.project_id
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid()
         OR s.created_by = auth.uid()
         OR s.assigned_to = auth.uid()
         OR s.reviewer_id = auth.uid()
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id)
         OR EXISTS (
           SELECT 1 FROM project_collaborators pc 
           WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
         )
    )
  );

CREATE POLICY "Authorized users can create script versions" ON script_versions
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    script_id IN (
      SELECT s.id FROM scripts s
      JOIN projects p ON p.id = s.project_id
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid()
         OR s.created_by = auth.uid()
         OR s.assigned_to = auth.uid()
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id AND u.role IN ('owner', 'creative-director', 'creator'))
         OR EXISTS (
           SELECT 1 FROM project_collaborators pc 
           WHERE pc.project_id = p.id AND pc.user_id = auth.uid() AND 'edit'::permission_type = ANY(pc.permissions)
         )
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authorized users can create notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid() OR created_by IS NULL
  );

-- Performance data policies
CREATE POLICY "Users can view own performance data" ON performance_data
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own performance data" ON performance_data
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own performance data" ON performance_data
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Team leads can view team performance data" ON performance_data
  FOR SELECT TO authenticated
  USING (
    script_id IN (
      SELECT s.id FROM scripts s
      JOIN projects p ON p.id = s.project_id
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid()
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id AND u.role IN ('owner', 'creative-director'))
    )
  );

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS profiles_company_name_idx ON profiles(company_name);
CREATE INDEX IF NOT EXISTS team_members_team_id_idx ON team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id);
CREATE INDEX IF NOT EXISTS project_collaborators_project_id_idx ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS project_collaborators_user_id_idx ON project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS script_comments_script_id_idx ON script_comments(script_id);
CREATE INDEX IF NOT EXISTS script_comments_user_id_idx ON script_comments(user_id);
CREATE INDEX IF NOT EXISTS script_comments_parent_id_idx ON script_comments(parent_id);
CREATE INDEX IF NOT EXISTS script_versions_script_id_idx ON script_versions(script_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
CREATE INDEX IF NOT EXISTS performance_data_script_id_idx ON performance_data(script_id);
CREATE INDEX IF NOT EXISTS performance_data_user_id_idx ON performance_data(user_id);

-- Create triggers for updated_at on new tables (with error handling)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_script_comments_updated_at') THEN
        CREATE TRIGGER update_script_comments_updated_at BEFORE UPDATE ON script_comments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(COALESCE(new.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', split_part(COALESCE(new.raw_user_meta_data->>'full_name', ''), ' ', 2))
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user profile creation (with error handling)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Create function to send notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  recipient_id uuid,
  notification_type notification_type,
  title text,
  message text,
  action_url text DEFAULT NULL,
  sender_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, action_url, created_by)
  VALUES (recipient_id, notification_type, title, message, action_url, sender_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ language plpgsql security definer;

-- Create function to get user's team permissions
CREATE OR REPLACE FUNCTION public.get_user_team_role(user_id uuid)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  SELECT role INTO user_role_result
  FROM users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role_result, 'viewer');
END;
$$ language plpgsql security definer;

-- Create function to check if user can access project
CREATE OR REPLACE FUNCTION public.can_user_access_project(user_id uuid, project_id uuid)
RETURNS boolean AS $$
DECLARE
  can_access boolean := false;
BEGIN
  -- Check if user is project owner
  SELECT EXISTS(
    SELECT 1 FROM projects WHERE id = project_id AND owner_id = user_id
  ) INTO can_access;
  
  IF can_access THEN
    RETURN true;
  END IF;
  
  -- Check if user is team member of project's team
  SELECT EXISTS(
    SELECT 1 FROM projects p
    JOIN users u ON u.id = user_id
    WHERE p.id = project_id 
      AND p.team_id IS NOT NULL 
      AND p.team_id = u.team_id
  ) INTO can_access;
  
  IF can_access THEN
    RETURN true;
  END IF;
  
  -- Check if user is project collaborator
  SELECT EXISTS(
    SELECT 1 FROM project_collaborators 
    WHERE project_id = project_id AND user_id = user_id
  ) INTO can_access;
  
  RETURN can_access;
END;
$$ language plpgsql security definer;