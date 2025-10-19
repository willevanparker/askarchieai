-- Add trade_in_note column to deal_analyses table
ALTER TABLE deal_analyses
ADD COLUMN trade_in_note TEXT;