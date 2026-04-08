import { useState } from "react";
import { Market } from "../types/market";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface TradingPanelProps {
  market: Market;
  onTrade: (
    marketId: string,
    side: "yes" | "no",
    amount: number,
    shares: number
  ) => void | Promise<void>;
}

export function TradingPanel({ market, onTrade }: TradingPanelProps) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState<string>("10");
  const [trading, setTrading] = useState(false);

  const price = side === "yes" ? market.yesPrice : market.noPrice;
  const shares = Number(amount) > 0 ? Number(amount) / price : 0;
  const potentialPayout = shares * 1;
  const potentialProfit = potentialPayout - Number(amount);

  const handleTrade = async () => {
    if (Number(amount) > 0 && !trading) {
      setTrading(true);
      try {
        await onTrade(market.id, side, Number(amount), shares);
        setAmount("10");
      } finally {
        setTrading(false);
      }
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-200">Trade</h3>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSide("yes")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            side === "yes"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Yes {Math.round(market.yesPrice * 100)}¢
        </button>
        <button
          onClick={() => setSide("no")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            side === "no"
              ? "bg-red-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          No {Math.round(market.noPrice * 100)}¢
        </button>
      </div>

      <div className="mb-3">
        <label className="mb-1.5 block text-xs text-zinc-400">Amount ($)</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="1"
          className="border-zinc-700 bg-zinc-800 text-zinc-200 focus:border-blue-500"
        />
      </div>

      <div className="mb-3 flex gap-2">
        {[5, 10, 25, 50, 100].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(String(preset))}
            className="flex-1 rounded-md bg-zinc-800 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            ${preset}
          </button>
        ))}
      </div>

      <Separator className="my-3 bg-zinc-800" />

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Avg. price</span>
          <span className="text-zinc-200">
            {Math.round(price * 100)}¢
          </span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Shares</span>
          <span className="text-zinc-200">{shares.toFixed(1)}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Potential payout</span>
          <span className="text-emerald-400">
            ${potentialPayout.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Potential profit</span>
          <span className="text-emerald-400">
            +${potentialProfit.toFixed(2)} (
            {Number(amount) > 0
              ? ((potentialProfit / Number(amount)) * 100).toFixed(0)
              : 0}
            %)
          </span>
        </div>
      </div>

      <Button
        onClick={handleTrade}
        disabled={Number(amount) <= 0 || trading}
        className={`w-full text-sm font-semibold ${
          side === "yes"
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {trading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
        ) : (
          <>Buy {side === "yes" ? "Yes" : "No"}</>
        )}
      </Button>
    </div>
  );
}
