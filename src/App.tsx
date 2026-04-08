import { useState, useMemo } from "react";
import "./App.css";
import { Market, Category } from "./types/market";
import { useSupabase } from "./hooks/useSupabase";
import { Header } from "./components/Header";
import { MarketCard } from "./components/MarketCard";
import { CategoryFilter } from "./components/CategoryFilter";
import { MarketDetail } from "./components/MarketDetail";
import { Portfolio } from "./components/Portfolio";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Loader2 } from "lucide-react";

function App() {
  const [activeView, setActiveView] = useState<"markets" | "portfolio">(
    "markets"
  );
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    markets,
    positions,
    balance,
    loading,
    error,
    handleTrade,
  } = useSupabase();

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesCategory =
        activeCategory === "All" || market.category === activeCategory;
      const matchesSearch = market.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, markets]);

  const trendingMarkets = useMemo(() => {
    return markets.filter((m) => m.trending).slice(0, 4);
  }, [markets]);

  const onTrade = async (
    marketId: string,
    side: "yes" | "no",
    amount: number,
    shares: number
  ) => {
    await handleTrade(marketId, side, amount, shares);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-zinc-400">Loading markets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="rounded-xl border border-red-800 bg-red-950/30 p-6 text-center">
          <p className="text-sm text-red-400">Failed to load data</p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selectedMarket) {
    const latestMarket =
      markets.find((m) => m.id === selectedMarket.id) ?? selectedMarket;
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
          market={latestMarket}
          onBack={() => setSelectedMarket(null)}
          onTrade={onTrade}
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
        {!searchQuery && activeCategory === "All" && trendingMarkets.length > 0 && (
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
