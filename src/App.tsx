import { useState, useMemo } from "react";
import "./App.css";
import { Market, Category, Position } from "./types/market";
import { markets, initialPositions } from "./data/markets";
import { Header } from "./components/Header";
import { MarketCard } from "./components/MarketCard";
import { CategoryFilter } from "./components/CategoryFilter";
import { MarketDetail } from "./components/MarketDetail";
import { Portfolio } from "./components/Portfolio";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame } from "lucide-react";

function App() {
  const [activeView, setActiveView] = useState<"markets" | "portfolio">(
    "markets"
  );
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesCategory =
        activeCategory === "All" || market.category === activeCategory;
      const matchesSearch = market.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const trendingMarkets = useMemo(() => {
    return markets.filter((m) => m.trending).slice(0, 4);
  }, []);

  const handleTrade = (
    marketId: string,
    side: "yes" | "no",
    amount: number,
    shares: number
  ) => {
    if (amount > balance) return;

    setBalance((prev) => prev - amount);

    const market = markets.find((m) => m.id === marketId);
    if (!market) return;

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
          currentPrice: side === "yes" ? market.yesPrice : market.noPrice,
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
          currentPrice: side === "yes" ? market.yesPrice : market.noPrice,
        },
      ]);
    }
  };

  if (selectedMarket) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header
          balance={balance}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewChange={(view) => {
            setActiveView(view);
            setSelectedMarket(null);
          }}
          activeView={activeView}
        />
        <MarketDetail
          market={selectedMarket}
          onBack={() => setSelectedMarket(null)}
          onTrade={handleTrade}
        />
      </div>
    );
  }

  if (activeView === "portfolio") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header
          balance={balance}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewChange={setActiveView}
          activeView={activeView}
        />
        <Portfolio positions={positions} balance={balance} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header
        balance={balance}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewChange={setActiveView}
        activeView={activeView}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Trending Banner */}
        {!searchQuery && activeCategory === "All" && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white">
                Trending Markets
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trendingMarkets.map((market) => (
                <button
                  key={market.id}
                  onClick={() => setSelectedMarket(market)}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-left transition-all hover:border-zinc-600 hover:bg-zinc-800/80"
                >
                  <img
                    src={market.imageUrl}
                    alt={market.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-zinc-200">
                      {market.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="mt-1 bg-emerald-500/20 px-1.5 py-0 text-xs text-emerald-400 hover:bg-emerald-500/20">
                        {Math.round(market.yesPrice * 100)}% Yes
                      </Badge>
                      <TrendingUp className="mt-1 h-3 w-3 text-blue-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Market Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-400">
            {filteredMarkets.length} market
            {filteredMarkets.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {/* Market Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onClick={setSelectedMarket}
            />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-zinc-500">
              No markets found. Try a different search or category.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-600">
          PredictX — A Polymarket-style prediction market clone. Not real
          money. For demonstration purposes only.
        </div>
      </footer>
    </div>
  );
}

export default App;
