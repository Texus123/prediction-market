import { useState, useEffect, useCallback, useRef } from "react";
import { Market, Position } from "../types/market";
import { fetchMarkets, fetchPositions, fetchBalance, executeTrade } from "../lib/api";

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

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [marketsData, balanceData] = await Promise.all([
          fetchMarkets(),
          fetchBalance(),
        ]);

        setMarkets(marketsData);
        setBalance(balanceData);

        // Build markets map for position lookups
        const map = new Map<string, Market>();
        marketsData.forEach((m) => map.set(m.id, m));
        marketsMapRef.current = map;

        const positionsData = await fetchPositions(map);
        setPositions(positionsData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data";
        setError(message);
        console.error("Supabase load error:", err);
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
      const market = marketsMapRef.current.get(marketId);
      if (!market) return;

      const price = side === "yes" ? market.yesPrice : market.noPrice;

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

        // Refresh positions from DB
        await refreshPositions();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Trade failed";
        console.error("Trade error:", message);
        setError(message);
      }
    },
    [balance, refreshPositions]
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
