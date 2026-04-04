import { Position } from "../types/market";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

interface PortfolioProps {
  positions: Position[];
  balance: number;
}

export function Portfolio({ positions, balance }: PortfolioProps) {
  const totalInvested = positions.reduce(
    (acc, p) => acc + p.shares * p.avgPrice,
    0
  );
  const totalValue = positions.reduce(
    (acc, p) => acc + p.shares * p.currentPrice,
    0
  );
  const totalPnL = totalValue - totalInvested;
  const totalPnLPercent =
    totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Portfolio</h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
            <DollarSign className="h-3 w-3" />
            Cash Balance
          </div>
          <div className="text-lg font-bold text-white">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
            <PieChart className="h-3 w-3" />
            Portfolio Value
          </div>
          <div className="text-lg font-bold text-white">
            ${totalValue.toFixed(2)}
          </div>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
            <DollarSign className="h-3 w-3" />
            Total Invested
          </div>
          <div className="text-lg font-bold text-white">
            ${totalInvested.toFixed(2)}
          </div>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            Total P&L
          </div>
          <div
            className={`text-lg font-bold ${
              totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)} (
            {totalPnLPercent.toFixed(1)}%)
          </div>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <div className="p-4">
          <h3 className="mb-4 text-sm font-semibold text-zinc-300">
            Open Positions
          </h3>
          {positions.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              No open positions yet. Start trading to build your portfolio!
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((position, i) => {
                const pnl =
                  (position.currentPrice - position.avgPrice) *
                  position.shares;
                const pnlPercent =
                  ((position.currentPrice - position.avgPrice) /
                    position.avgPrice) *
                  100;
                return (
                  <div key={`${position.marketId}-${i}`}>
                    {i > 0 && <Separator className="mb-3 bg-zinc-800" />}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-1 text-sm font-medium text-zinc-200">
                          {position.marketTitle}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              position.side === "yes"
                                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                            }
                          >
                            {position.side.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-zinc-500">
                            {position.shares} shares @ {Math.round(position.avgPrice * 100)}¢
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-zinc-200">
                          ${(position.shares * position.currentPrice).toFixed(2)}
                        </div>
                        <div
                          className={`text-xs ${
                            pnl >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} (
                          {pnlPercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
