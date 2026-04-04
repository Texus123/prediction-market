import { Market } from "../types/market";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TradingPanel } from "./TradingPanel";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Droplets,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MarketDetailProps {
  market: Market;
  onBack: () => void;
  onTrade: (
    marketId: string,
    side: "yes" | "no",
    amount: number,
    shares: number
  ) => void;
}

function formatVolume(volume: number): string {
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(0)}K`;
  return `$${volume}`;
}

export function MarketDetail({ market, onBack, onTrade }: MarketDetailProps) {
  const yesPercent = Math.round(market.yesPrice * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to markets
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 flex items-start gap-4">
              <img
                src={market.imageUrl}
                alt={market.title}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-zinc-700 text-zinc-400"
                  >
                    {market.category}
                  </Badge>
                  {market.trending && (
                    <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl font-bold text-white">{market.title}</h1>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs text-zinc-500">
                  <BarChart3 className="h-3 w-3" />
                  Volume
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  {formatVolume(market.volume)}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs text-zinc-500">
                  <Droplets className="h-3 w-3" />
                  Liquidity
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  {formatVolume(market.liquidity)}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  End Date
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  {market.endDate}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <div className="mb-1 text-xs text-zinc-500">Probability</div>
                <div className="text-sm font-semibold text-emerald-400">
                  {yesPercent}% Yes
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-zinc-800" />

            <div className="mb-4">
              <h3 className="mb-3 text-sm font-semibold text-zinc-300">
                Price History
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={market.priceHistory}>
                    <defs>
                      <linearGradient
                        id="yesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={{ stroke: "#3f3f46" }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, 1]}
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={{ stroke: "#3f3f46" }}
                      tickLine={false}
                      tickFormatter={(v: number) => `${Math.round(v * 100)}¢`}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "#a1a1aa" }}
                      formatter={(value: number) => [
                        `${Math.round(value * 100)}¢`,
                        "Yes",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="yes"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#yesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Separator className="my-4 bg-zinc-800" />

            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-300">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {market.description}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <TradingPanel market={market} onTrade={onTrade} />
        </div>
      </div>
    </div>
  );
}
