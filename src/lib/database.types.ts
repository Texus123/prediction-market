export interface DbMarket {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  yes_price: number;
  no_price: number;
  volume: number;
  liquidity: number;
  end_date: string;
  resolved: boolean;
  outcome: "yes" | "no" | null;
  trending: boolean;
  created_at: string;
}

export interface DbTrade {
  id: string;
  market_id: string;
  side: "yes" | "no";
  amount: number;
  shares: number;
  price: number;
  created_at: string;
}

export interface DbPosition {
  id: string;
  market_id: string;
  side: "yes" | "no";
  shares: number;
  avg_price: number;
  created_at: string;
  updated_at: string;
}

export interface DbWallet {
  id: string;
  balance: number;
  updated_at: string;
}

export interface DbPriceHistory {
  id: string;
  market_id: string;
  yes_price: number;
  no_price: number;
  recorded_at: string;
}
