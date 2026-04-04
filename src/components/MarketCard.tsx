import { Market } from "../types/market";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, BarChart3 } from "lucide-react";

interface MarketCardProps {
  market: Market;
  onClick: (market: Market) => void;
}

function formatVolume(volume: number): string {
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(0)}K`;
  return `$${volume}`;
}

export function MarketCard({ market, onClick }: MarketCardProps) {
  const yesPercent = Math.round(market.yesPrice * 100);

  return (
    <Card
      className="group cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-600 hover:bg-zinc-800/80"
      onClick={() => onClick(market)}
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-zinc-700 text-xs text-zinc-400"
              >
                {market.category}
              </Badge>
              {market.trending && (
                <Badge className="bg-blue-500/20 text-xs text-blue-400 hover:bg-blue-500/20">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Trending
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold leading-tight text-zinc-100 group-hover:text-white">
              {market.title}
            </h3>
          </div>
          <img
            src={market.imageUrl}
            alt={market.title}
            className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
          />
        </div>

        <div className="mb-3 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500/15 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25">
            Yes {yesPercent}¢
          </button>
          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500/15 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/25">
            No {100 - yesPercent}¢
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>{formatVolume(market.volume)} Vol.</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{market.endDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
