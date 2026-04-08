import { Market, Position } from "../types/market";

function generatePriceHistory(
  currentYes: number,
  days: number = 30
): { date: string; yes: number; no: number }[] {
  const history: { date: string; yes: number; no: number }[] = [];
  let price = currentYes - (Math.random() * 0.3 - 0.15);
  price = Math.max(0.05, Math.min(0.95, price));

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * 0.08;
    price = Math.max(0.05, Math.min(0.95, price + change));
    if (i === 0) price = currentYes;
    history.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      yes: Math.round(price * 100) / 100,
      no: Math.round((1 - price) * 100) / 100,
    });
  }
  return history;
}

export const markets: Market[] = [
  {
    id: "1",
    title: "Will Bitcoin exceed $150K by end of 2026?",
    description:
      "This market resolves YES if the price of Bitcoin (BTC) exceeds $150,000 USD on any major exchange before December 31, 2026 11:59 PM ET.",
    category: "Crypto",
    imageUrl: "https://placehold.co/400x300/f7931a/white?text=BTC",
    yesPrice: 0.62,
    noPrice: 0.38,
    volume: 18420000,
    liquidity: 4200000,
    endDate: "Dec 31, 2026",
    resolved: false,
    trending: true,
    priceHistory: [],
  },
  {
    id: "2",
    title: "Will AI pass the Turing Test by 2027?",
    description:
      "This market resolves YES if a credible AI system passes a formal Turing Test administered by a recognized institution before January 1, 2027.",
    category: "Tech",
    imageUrl: "https://placehold.co/400x300/8b5cf6/white?text=AI",
    yesPrice: 0.45,
    noPrice: 0.55,
    volume: 9850000,
    liquidity: 2100000,
    endDate: "Jan 1, 2027",
    resolved: false,
    trending: true,
    priceHistory: [],
  },
  {
    id: "3",
    title: "Democrats to win 2026 midterm Senate majority?",
    description:
      "This market resolves YES if the Democratic Party holds a majority of seats in the U.S. Senate after the 2026 midterm elections.",
    category: "Politics",
    imageUrl: "https://placehold.co/400x300/3b82f6/white?text=Senate",
    yesPrice: 0.41,
    noPrice: 0.59,
    volume: 32100000,
    liquidity: 8500000,
    endDate: "Nov 3, 2026",
    resolved: false,
    trending: true,
    priceHistory: [],
  },
  {
    id: "4",
    title: "Will Ethereum flip Bitcoin market cap in 2026?",
    description:
      "This market resolves YES if Ethereum's market capitalization surpasses Bitcoin's at any point during 2026.",
    category: "Crypto",
    imageUrl: "https://placehold.co/400x300/627eea/white?text=ETH",
    yesPrice: 0.12,
    noPrice: 0.88,
    volume: 6300000,
    liquidity: 1800000,
    endDate: "Dec 31, 2026",
    resolved: false,
    trending: false,
    priceHistory: [],
  },
  {
    id: "5",
    title: "Will SpaceX Starship reach orbit in 2026?",
    description:
      "This market resolves YES if SpaceX's Starship vehicle successfully reaches orbit (defined as completing at least one full orbit of Earth) in 2026.",
    category: "Science",
    imageUrl: "https://placehold.co/400x300/1e293b/white?text=SpaceX",
    yesPrice: 0.87,
    noPrice: 0.13,
    volume: 12400000,
    liquidity: 3100000,
    endDate: "Dec 31, 2026",
    resolved: false,
    trending: true,
    priceHistory: [],
  },
  {
    id: "6",
    title: "FIFA World Cup 2026: Will USA reach semifinals?",
    description:
      "This market resolves YES if the United States Men's National Team reaches the semifinals of the 2026 FIFA World Cup.",
    category: "Sports",
    imageUrl: "https://placehold.co/400x300/16a34a/white?text=FIFA",
    yesPrice: 0.34,
    noPrice: 0.66,
    volume: 21500000,
    liquidity: 5200000,
    endDate: "Jul 19, 2026",
    resolved: false,
    trending: true,
    priceHistory: [],
  },
  {
    id: "7",
    title: "Will the Fed cut rates below 3% by end of 2026?",
    description:
      "This market resolves YES if the Federal Reserve's target federal funds rate falls below 3.00% at any point before December 31, 2026.",
    category: "Finance",
    imageUrl: "https://placehold.co/400x300/0ea5e9/white?text=Fed",
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 14200000,
    liquidity: 3800000,
    endDate: "Dec 31, 2026",
    resolved: false,
    trending: false,
    priceHistory: [],
  },
  {
    id: "8",
    title: "Will GTA VI release before June 2026?",
    description:
      "This market resolves YES if Grand Theft Auto VI is officially released and available for purchase before June 1, 2026.",
    category: "Entertainment",
    imageUrl: "https://placehold.co/400x300/ef4444/white?text=GTA+VI",
    yesPrice: 0.15,
    noPrice: 0.85,
    volume: 8700000,
    liquidity: 2400000,
    endDate: "Jun 1, 2026",
    resolved: false,
    trending: false,
    priceHistory: [],
  },
  {
    id: "9",
    title: "Will Apple release a foldable iPhone in 2026?",
    description:
      "This market resolves YES if Apple officially announces and releases a foldable iPhone product in 2026.",
    category: "Tech",
    imageUrl: "https://placehold.co/400x300/a855f7/white?text=Apple",
    yesPrice: 0.22,
    noPrice: 0.78,
    volume: 5400000,
    liquidity: 1500000,
    endDate: "Dec 31, 2026",
    resolved: false,
    trending: false,
    priceHistory: [],
  },
  {
    id: "10",
    title: "Will Tesla stock exceed $500 by mid-2026?",
    description:
      "This market resolves YES if Tesla (TSLA) stock price exceeds $500 per share on any trading day before July 1, 2026.",
    category: "Finance",
    imageUrl: "https://placehold.co/400x300/dc2626/white?text=TSLA",
    yesPrice: 0.55,
    noPrice: 0.45,
    volume: 16800000,
    liquidity: 4600000,
    endDate: "Jul 1, 2026",
    resolved: false,
    trending: true,
    priceHistory: [],
  },
  {
    id: "11",
    title: "Champions League 2026: Will Real Madrid win?",
    description:
      "This market resolves YES if Real Madrid wins the 2025-26 UEFA Champions League.",
    category: "Sports",
    imageUrl: "https://placehold.co/400x300/fbbf24/white?text=UCL",
    yesPrice: 0.31,
    noPrice: 0.69,
    volume: 11200000,
    liquidity: 2900000,
    endDate: "May 30, 2026",
    resolved: false,
    trending: false,
    priceHistory: [],
  },
  {
    id: "12",
    title: "Will Solana reach $500 in 2026?",
    description:
      "This market resolves YES if Solana (SOL) exceeds $500 USD on any major exchange in 2026.",
    category: "Crypto",
    imageUrl: "https://placehold.co/400x300/9945ff/white?text=SOL",
    yesPrice: 0.18,
    noPrice: 0.82,
    volume: 7600000,
    liquidity: 2100000,
    endDate: "Dec 31, 2026",
    resolved: false,
    trending: false,
    priceHistory: [],
  },
];

// Generate price history for all markets
markets.forEach((market) => {
  market.priceHistory = generatePriceHistory(market.yesPrice);
});

export const initialPositions: Position[] = [
  {
    marketId: "1",
    marketTitle: "Will Bitcoin exceed $150K by end of 2026?",
    side: "yes",
    shares: 150,
    avgPrice: 0.48,
    currentPrice: 0.62,
  },
  {
    marketId: "3",
    marketTitle: "Democrats to win 2026 midterm Senate majority?",
    side: "no",
    shares: 200,
    avgPrice: 0.52,
    currentPrice: 0.59,
  },
  {
    marketId: "5",
    marketTitle: "Will SpaceX Starship reach orbit in 2026?",
    side: "yes",
    shares: 100,
    avgPrice: 0.75,
    currentPrice: 0.87,
  },
];
