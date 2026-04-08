-- PredictX Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  yes_price NUMERIC(5,4) NOT NULL DEFAULT 0.5,
  no_price NUMERIC(5,4) NOT NULL DEFAULT 0.5,
  volume BIGINT NOT NULL DEFAULT 0,
  liquidity BIGINT NOT NULL DEFAULT 0,
  end_date TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  outcome TEXT CHECK (outcome IN ('yes', 'no')),
  trending BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('yes', 'no')),
  amount NUMERIC(12,2) NOT NULL,
  shares NUMERIC(12,4) NOT NULL,
  price NUMERIC(5,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Positions table (aggregated view of trades per market/side)
CREATE TABLE IF NOT EXISTS positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('yes', 'no')),
  shares NUMERIC(12,4) NOT NULL DEFAULT 0,
  avg_price NUMERIC(5,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(market_id, side)
);

-- Wallet table (single row for the user's balance)
CREATE TABLE IF NOT EXISTS wallet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  balance NUMERIC(12,2) NOT NULL DEFAULT 10000.00,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  yes_price NUMERIC(5,4) NOT NULL,
  no_price NUMERIC(5,4) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (allow all for demo — no auth)
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Policies: allow all operations for anon users (demo app)
CREATE POLICY "Allow all on markets" ON markets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on trades" ON trades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on positions" ON positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on wallet" ON wallet FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on price_history" ON price_history FOR ALL USING (true) WITH CHECK (true);

-- Insert initial wallet
INSERT INTO wallet (balance) VALUES (10000.00);
