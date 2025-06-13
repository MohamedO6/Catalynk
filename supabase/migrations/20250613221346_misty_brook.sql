/*
  # Create investments and escrow tables

  1. New Tables
    - `investments`
      - `id` (uuid, primary key)
      - `investor_id` (uuid, foreign key to profiles)
      - `project_id` (uuid, foreign key to projects)
      - `amount` (numeric)
      - `status` (text)
      - `escrow_contract_id` (text, nullable)
      - `terms` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `escrow_contracts`
      - `id` (uuid, primary key)
      - `contract_address` (text)
      - `investor_id` (uuid, foreign key to profiles)
      - `founder_id` (uuid, foreign key to profiles)
      - `project_id` (uuid, foreign key to projects)
      - `amount` (numeric)
      - `status` (text)
      - `milestones` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Investments Table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  escrow_contract_id TEXT,
  terms JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(investor_id, project_id)
);

-- Escrow Contracts Table
CREATE TABLE IF NOT EXISTS escrow_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_address TEXT UNIQUE NOT NULL,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  founder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'funded', 'released', 'disputed', 'cancelled')),
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_contracts ENABLE ROW LEVEL SECURITY;

-- Policies for investments
CREATE POLICY "Investors can view own investments" ON investments
  FOR SELECT USING (auth.uid() = investor_id);

CREATE POLICY "Project founders can view investments in their projects" ON investments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT founder_id FROM projects WHERE id = project_id
    )
  );

CREATE POLICY "Investors can create investments" ON investments
  FOR INSERT WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Investors can update own investments" ON investments
  FOR UPDATE USING (auth.uid() = investor_id);

-- Policies for escrow_contracts
CREATE POLICY "Parties can view own contracts" ON escrow_contracts
  FOR SELECT USING (auth.uid() = investor_id OR auth.uid() = founder_id);

CREATE POLICY "System can create contracts" ON escrow_contracts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Parties can update contracts" ON escrow_contracts
  FOR UPDATE USING (auth.uid() = investor_id OR auth.uid() = founder_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS investments_investor_id_idx ON investments(investor_id);
CREATE INDEX IF NOT EXISTS investments_project_id_idx ON investments(project_id);
CREATE INDEX IF NOT EXISTS investments_status_idx ON investments(status);

CREATE INDEX IF NOT EXISTS escrow_contracts_investor_id_idx ON escrow_contracts(investor_id);
CREATE INDEX IF NOT EXISTS escrow_contracts_founder_id_idx ON escrow_contracts(founder_id);
CREATE INDEX IF NOT EXISTS escrow_contracts_project_id_idx ON escrow_contracts(project_id);
CREATE INDEX IF NOT EXISTS escrow_contracts_status_idx ON escrow_contracts(status);

-- Create triggers for updated_at
CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escrow_contracts_updated_at
  BEFORE UPDATE ON escrow_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update project funding when investment is made
CREATE OR REPLACE FUNCTION update_project_funding()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE projects 
    SET current_funding = current_funding + NEW.amount 
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE projects 
      SET current_funding = current_funding + NEW.amount 
      WHERE id = NEW.project_id;
    ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE projects 
      SET current_funding = current_funding - OLD.amount 
      WHERE id = OLD.project_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE projects 
    SET current_funding = current_funding - OLD.amount 
    WHERE id = OLD.project_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for project funding updates
CREATE TRIGGER investments_funding_trigger
  AFTER INSERT OR UPDATE OR DELETE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_project_funding();