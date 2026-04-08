import { supabase } from "./supabase";
import { Market, Position, PricePoint } from "../types/market";
import type {
  DbMarket,
  DbPosition,
  DbPriceHistory,
} from "./database.types";

// Convert DB market row to frontend Market type
function toMarket(row: DbMarket, priceHistory: PricePoint[]): Market {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url,
    yesPrice: Number(row.yes_price),
    noPrice: Number(row.no_price),
    volume: Number(row.volume),
    liquidity: Number(row.liquidity),
    endDate: row.end_date,
    resolved: row.resolved,
    outcome: row.outcome ?? undefined,
    trending: row.trending,
    priceHistory,
  };
}

function toPricePoint(row: DbPriceHistory): PricePoint {
  const d = new Date(row.recorded_at);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    yes: Number(row.yes_price),
    no: Number(row.no_price),
  };
}

// ── Markets ──────────────────────────────────────────────

export async function fetchMarkets(): Promise<Market[]> {
  const { data: rows, error } = await supabase
    .from("markets")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!rows) return [];

  // Fetch all price history in one query
  const { data: historyRows } = await supabase
    .from("price_history")
    .select("*")
    .order("recorded_at", { ascending: true });

  const historyByMarket = new Map<string, PricePoint[]>();
  (historyRows ?? []).forEach((h: DbPriceHistory) => {
    const arr = historyByMarket.get(h.market_id) ?? [];
    arr.push(toPricePoint(h));
    historyByMarket.set(h.market_id, arr);
  });

  return (rows as DbMarket[]).map((r) =>
    toMarket(r, historyByMarket.get(r.id) ?? [])
  );
}

export async function fetchMarketById(id: string): Promise<Market | null> {
  const { data: row, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) return null;

  const { data: historyRows } = await supabase
    .from("price_history")
    .select("*")
    .eq("market_id", id)
    .order("recorded_at", { ascending: true });

  return toMarket(
    row as DbMarket,
    (historyRows ?? []).map(toPricePoint)
  );
}

// ── Positions ────────────────────────────────────────────

export async function fetchPositions(
  marketsMap: Map<string, Market>
): Promise<Position[]> {
  const { data: rows, error } = await supabase
    .from("positions")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!rows) return [];

  return (rows as DbPosition[]).map((r) => {
    const market = marketsMap.get(r.market_id);
    return {
      marketId: r.market_id,
      marketTitle: market?.title ?? "Unknown Market",
      side: r.side,
      shares: Number(r.shares),
      avgPrice: Number(r.avg_price),
      currentPrice: market
        ? r.side === "yes"
          ? market.yesPrice
          : market.noPrice
        : 0,
    };
  });
}

// ── Wallet ───────────────────────────────────────────────

export async function fetchBalance(): Promise<number> {
  const { data, error } = await supabase
    .from("wallet")
    .select("balance")
    .limit(1)
    .single();

  if (error) throw error;
  return Number(data.balance);
}

async function updateBalance(newBalance: number): Promise<void> {
  // Get the wallet row id first
  const { data: wallet } = await supabase
    .from("wallet")
    .select("id")
    .limit(1)
    .single();

  if (!wallet) return;

  const { error } = await supabase
    .from("wallet")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", wallet.id);

  if (error) throw error;
}

// ── Trading ──────────────────────────────────────────────

export async function executeTrade(
  marketId: string,
  side: "yes" | "no",
  amount: number,
  shares: number,
  price: number,
  currentBalance: number
): Promise<{ newBalance: number }> {
  if (amount > currentBalance) {
    throw new Error("Insufficient balance");
  }

  const newBalance = currentBalance - amount;

  // Insert trade record
  const { error: tradeError } = await supabase.from("trades").insert({
    market_id: marketId,
    side,
    amount,
    shares,
    price,
  });
  if (tradeError) throw tradeError;

  // Upsert position
  const { data: existing } = await supabase
    .from("positions")
    .select("*")
    .eq("market_id", marketId)
    .eq("side", side)
    .maybeSingle();

  if (existing) {
    const oldShares = Number(existing.shares);
    const oldAvg = Number(existing.avg_price);
    const totalShares = oldShares + shares;
    const totalCost = oldShares * oldAvg + shares * price;
    const newAvg = totalCost / totalShares;

    const { error: posError } = await supabase
      .from("positions")
      .update({
        shares: totalShares,
        avg_price: newAvg,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (posError) throw posError;
  } else {
    const { error: posError } = await supabase.from("positions").insert({
      market_id: marketId,
      side,
      shares,
      avg_price: price,
    });
    if (posError) throw posError;
  }

  // Update wallet
  await updateBalance(newBalance);

  return { newBalance };
}
