/*
  # Initial MindCue Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `role` (enum: owner, creative-director, creator, viewer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `onboarding_completed` (boolean, default false)
      - `team_id` (uuid, nullable, references teams)

    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `owner_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `subscription_status` (enum: trial, active, cancelled, past_due)
      - `max_members` (integer, default 5)

    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `owner_id` (uuid, references users)
      - `team_id` (uuid, nullable, references teams)
      - `product_data` (jsonb)
      - `audience_data` (jsonb)
      - `status` (enum: active, completed, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `scripts`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `title` (text)
      - `concept` (text)
      - `content` (jsonb)
      - `status` (enum: draft, ready-for-review, changes-requested, approved, rejected)
      - `created_by` (uuid, references users)
      - `assigned_to` (uuid, nullable, references users)
      - `reviewer_id` (uuid, nullable, references users)
      - `performance_data` (jsonb, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Team-based access for projects and scripts
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'creative-director', 'creator', 'viewer');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE script_status AS ENUM ('draft', 'ready-for-review', 'changes-requested', 'approved', 'rejected');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'cancelled', 'past_due');

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  subscription_status subscription_status DEFAULT 'trial',
  max_members integer DEFAULT 5
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'owner',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  onboarding_completed boolean DEFAULT false,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  product_data jsonb DEFAULT '{}',
  audience_data jsonb DEFAULT '{}',
  status project_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  concept text NOT NULL,
  content jsonb DEFAULT '{}',
  status script_status DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  performance_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for teams.owner_id
ALTER TABLE teams ADD CONSTRAINT teams_owner_id_fkey 
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read team members" ON users
  FOR SELECT TO authenticated
  USING (
    team_id IS NOT NULL AND 
    team_id IN (
      SELECT team_id FROM users WHERE id = auth.uid()
    )
  );

-- Teams policies
CREATE POLICY "Team owners can manage their teams" ON teams
  FOR ALL TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Team members can read their team" ON teams
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT team_id FROM users WHERE id = auth.uid()
    )
  );

-- Projects policies
CREATE POLICY "Project owners can manage their projects" ON projects
  FOR ALL TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Team members can read team projects" ON projects
  FOR SELECT TO authenticated
  USING (
    team_id IS NOT NULL AND
    team_id IN (
      SELECT team_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Team creators can create projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = auth.uid() OR
    (team_id IS NOT NULL AND team_id IN (
      SELECT team_id FROM users 
      WHERE id = auth.uid() AND role IN ('owner', 'creative-director', 'creator')
    ))
  );

CREATE POLICY "Team members can update assigned projects" ON projects
  FOR UPDATE TO authenticated
  USING (
    owner_id = auth.uid() OR
    (team_id IS NOT NULL AND team_id IN (
      SELECT team_id FROM users 
      WHERE id = auth.uid() AND role IN ('owner', 'creative-director', 'creator')
    ))
  );

-- Scripts policies
CREATE POLICY "Script creators can manage their scripts" ON scripts
  FOR ALL TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Project team members can read scripts" ON scripts
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid() 
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id)
    )
  );

CREATE POLICY "Assigned users can update scripts" ON scripts
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    reviewer_id = auth.uid() OR
    project_id IN (
      SELECT p.id FROM projects p
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid() 
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id AND u.role IN ('owner', 'creative-director'))
    )
  );

CREATE POLICY "Team creators can create scripts" ON scripts
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    project_id IN (
      SELECT p.id FROM projects p
      JOIN users u ON u.id = auth.uid()
      WHERE p.owner_id = auth.uid() 
         OR (p.team_id IS NOT NULL AND p.team_id = u.team_id AND u.role IN ('owner', 'creative-director', 'creator'))
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_team_id_idx ON users(team_id);
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id);
CREATE INDEX IF NOT EXISTS projects_team_id_idx ON projects(team_id);
CREATE INDEX IF NOT EXISTS scripts_project_id_idx ON scripts(project_id);
CREATE INDEX IF NOT EXISTS scripts_created_by_idx ON scripts(created_by);
CREATE INDEX IF NOT EXISTS scripts_assigned_to_idx ON scripts(assigned_to);
CREATE INDEX IF NOT EXISTS scripts_reviewer_id_idx ON scripts(reviewer_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();