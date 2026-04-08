import { useState, useEffect, useCallback, useRef } from "react";
import { Market, Position } from "../types/market";
import { fetchMarkets, fetchPositions, fetchBalance, executeTrade } from "../lib/api";
import { markets as mockMarkets, initialPositions as mockPositions } from "../data/markets";

interface UseSupabaseReturn {
  markets: Market[];
  positions: Position[];
  balance: number;
  loading: boolean;
  error: string | null;
  handleTrade: (
    marketId: string,
    side: "yes" | "no",
    amount: number,
    shares: number
  ) => Promise<void>;
  refreshPositions: () => Promise<void>;
}

export function useSupabase(): UseSupabaseReturn {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [balance, setBalance] = useState(10000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const marketsMapRef = useRef(new Map<string, Market>());

  const usingFallbackRef = useRef(false);

  // Load initial data — try Supabase first, fall back to mock data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [marketsData, balanceData] = await Promise.all([
          fetchMarkets(),
          fetchBalance(),
        ]);

        if (marketsData.length === 0) {
          throw new Error("No markets found — tables may not be seeded");
        }

        setMarkets(marketsData);
        setBalance(balanceData);

        const map = new Map<string, Market>();
        marketsData.forEach((m) => map.set(m.id, m));
        marketsMapRef.current = map;

        const positionsData = await fetchPositions(map);
        setPositions(positionsData);
      } catch (err) {
        console.warn("Supabase unavailable, using mock data:", err);
        usingFallbackRef.current = true;

        // Fall back to mock data
        setMarkets(mockMarkets);
        setBalance(10000);
        setPositions(mockPositions);

        const map = new Map<string, Market>();
        mockMarkets.forEach((m) => map.set(m.id, m));
        marketsMapRef.current = map;

        setError(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const refreshPositions = useCallback(async () => {
    try {
      const positionsData = await fetchPositions(marketsMapRef.current);
      setPositions(positionsData);
    } catch (err) {
      console.error("Failed to refresh positions:", err);
    }
  }, []);

  const handleTrade = useCallback(
    async (
      marketId: string,
      side: "yes" | "no",
      amount: number,
      shares: number
    ) => {
      if (amount > balance) return;

      const market = marketsMapRef.current.get(marketId);
      if (!market) return;

      const price = side === "yes" ? market.yesPrice : market.noPrice;

      if (usingFallbackRef.current) {
        // Local-only trade (mock mode)
        setBalance((prev) => prev - amount);

        const existingIdx = positions.findIndex(
          (p) => p.marketId === marketId && p.side === side
        );

        if (existingIdx >= 0) {
          setPositions((prev) => {
            const updated = [...prev];
            const existing = updated[existingIdx];
            const totalShares = existing.shares + shares;
            const totalCost =
              existing.shares * existing.avgPrice + shares * (amount / shares);
            updated[existingIdx] = {
              ...existing,
              shares: totalShares,
              avgPrice: totalCost / totalShares,
              currentPrice: price,
            };
            return updated;
          });
        } else {
          setPositions((prev) => [
            ...prev,
            {
              marketId,
              marketTitle: market.title,
              side,
              shares,
              avgPrice: amount / shares,
              currentPrice: price,
            },
          ]);
        }
        return;
      }

      try {
        const { newBalance } = await executeTrade(
          marketId,
          side,
          amount,
          shares,
          price,
          balance
        );

        setBalance(newBalance);
        await refreshPositions();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Trade failed";
        console.error("Trade error:", message);
        setError(message);
      }
    },
    [balance, positions, refreshPositions]
  );

  return {
    markets,
    positions,
    balance,
    loading,
    error,
    handleTrade,
    refreshPositions,
  };
}
