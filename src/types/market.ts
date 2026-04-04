export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  endDate: string;
  resolved: boolean;
  outcome?: "yes" | "no";
  trending: boolean;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  date: string;
  yes: number;
  no: number;
}

export interface Position {
  marketId: string;
  marketTitle: string;
  side: "yes" | "no";
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export type Category =
  | "All"
  | "Politics"
  | "Crypto"
  | "Sports"
  | "Tech"
  | "Science"
  | "Entertainment"
  | "Finance";
