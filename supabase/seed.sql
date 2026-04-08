-- PredictX Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor

-- Insert markets
INSERT INTO markets (id, title, description, category, image_url, yes_price, no_price, volume, liquidity, end_date, resolved, trending) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Will Bitcoin exceed $150K by end of 2026?', 'This market resolves YES if the price of Bitcoin (BTC) exceeds $150,000 USD on any major exchange before December 31, 2026 11:59 PM ET.', 'Crypto', 'https://placehold.co/400x300/f7931a/white?text=BTC', 0.62, 0.38, 18420000, 4200000, 'Dec 31, 2026', false, true),
  ('00000000-0000-0000-0000-000000000002', 'Will AI pass the Turing Test by 2027?', 'This market resolves YES if a credible AI system passes a formal Turing Test administered by a recognized institution before January 1, 2027.', 'Tech', 'https://placehold.co/400x300/8b5cf6/white?text=AI', 0.45, 0.55, 9850000, 2100000, 'Jan 1, 2027', false, true),
  ('00000000-0000-0000-0000-000000000003', 'Democrats to win 2026 midterm Senate majority?', 'This market resolves YES if the Democratic Party holds a majority of seats in the U.S. Senate after the 2026 midterm elections.', 'Politics', 'https://placehold.co/400x300/3b82f6/white?text=Senate', 0.41, 0.59, 32100000, 8500000, 'Nov 3, 2026', false, true),
  ('00000000-0000-0000-0000-000000000004', 'Will Ethereum flip Bitcoin market cap in 2026?', 'This market resolves YES if Ethereum''s market capitalization surpasses Bitcoin''s at any point during 2026.', 'Crypto', 'https://placehold.co/400x300/627eea/white?text=ETH', 0.12, 0.88, 6300000, 1800000, 'Dec 31, 2026', false, false),
  ('00000000-0000-0000-0000-000000000005', 'Will SpaceX Starship reach orbit in 2026?', 'This market resolves YES if SpaceX''s Starship vehicle successfully reaches orbit (defined as completing at least one full orbit of Earth) in 2026.', 'Science', 'https://placehold.co/400x300/1e293b/white?text=SpaceX', 0.87, 0.13, 12400000, 3100000, 'Dec 31, 2026', false, true),
  ('00000000-0000-0000-0000-000000000006', 'FIFA World Cup 2026: Will USA reach semifinals?', 'This market resolves YES if the United States Men''s National Team reaches the semifinals of the 2026 FIFA World Cup.', 'Sports', 'https://placehold.co/400x300/16a34a/white?text=FIFA', 0.34, 0.66, 21500000, 5200000, 'Jul 19, 2026', false, true),
  ('00000000-0000-0000-0000-000000000007', 'Will the Fed cut rates below 3% by end of 2026?', 'This market resolves YES if the Federal Reserve''s target federal funds rate falls below 3.00% at any point before December 31, 2026.', 'Finance', 'https://placehold.co/400x300/0ea5e9/white?text=Fed', 0.28, 0.72, 14200000, 3800000, 'Dec 31, 2026', false, false),
  ('00000000-0000-0000-0000-000000000008', 'Will GTA VI release before June 2026?', 'This market resolves YES if Grand Theft Auto VI is officially released and available for purchase before June 1, 2026.', 'Entertainment', 'https://placehold.co/400x300/ef4444/white?text=GTA+VI', 0.15, 0.85, 8700000, 2400000, 'Jun 1, 2026', false, false),
  ('00000000-0000-0000-0000-000000000009', 'Will Apple release a foldable iPhone in 2026?', 'This market resolves YES if Apple officially announces and releases a foldable iPhone product in 2026.', 'Tech', 'https://placehold.co/400x300/a855f7/white?text=Apple', 0.22, 0.78, 5400000, 1500000, 'Dec 31, 2026', false, false),
  ('00000000-0000-0000-0000-000000000010', 'Will Tesla stock exceed $500 by mid-2026?', 'This market resolves YES if Tesla (TSLA) stock price exceeds $500 per share on any trading day before July 1, 2026.', 'Finance', 'https://placehold.co/400x300/dc2626/white?text=TSLA', 0.55, 0.45, 16800000, 4600000, 'Jul 1, 2026', false, true),
  ('00000000-0000-0000-0000-000000000011', 'Champions League 2026: Will Real Madrid win?', 'This market resolves YES if Real Madrid wins the 2025-26 UEFA Champions League.', 'Sports', 'https://placehold.co/400x300/fbbf24/white?text=UCL', 0.31, 0.69, 11200000, 2900000, 'May 30, 2026', false, false),
  ('00000000-0000-0000-0000-000000000012', 'Will Solana reach $500 in 2026?', 'This market resolves YES if Solana (SOL) exceeds $500 USD on any major exchange in 2026.', 'Crypto', 'https://placehold.co/400x300/9945ff/white?text=SOL', 0.18, 0.82, 7600000, 2100000, 'Dec 31, 2026', false, false);

-- Insert initial positions
INSERT INTO positions (market_id, side, shares, avg_price) VALUES
  ('00000000-0000-0000-0000-000000000001', 'yes', 150, 0.48),
  ('00000000-0000-0000-0000-000000000003', 'no', 200, 0.52),
  ('00000000-0000-0000-0000-000000000005', 'yes', 100, 0.75);

-- Generate price history for each market (30 days of data)
DO $$
DECLARE
  m RECORD;
  i INTEGER;
  price NUMERIC;
  d TIMESTAMPTZ;
BEGIN
  FOR m IN SELECT id, yes_price FROM markets LOOP
    price := m.yes_price - (random() * 0.3 - 0.15);
    IF price < 0.05 THEN price := 0.05; END IF;
    IF price > 0.95 THEN price := 0.95; END IF;
    
    FOR i IN REVERSE 30..0 LOOP
      d := now() - (i || ' days')::INTERVAL;
      price := price + (random() - 0.5) * 0.08;
      IF price < 0.05 THEN price := 0.05; END IF;
      IF price > 0.95 THEN price := 0.95; END IF;
      IF i = 0 THEN price := m.yes_price; END IF;
      
      INSERT INTO price_history (market_id, yes_price, no_price, recorded_at)
      VALUES (m.id, ROUND(price::NUMERIC, 4), ROUND((1 - price)::NUMERIC, 4), d);
    END LOOP;
  END LOOP;
END $$;
