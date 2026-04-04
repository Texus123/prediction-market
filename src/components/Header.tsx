import { TrendingUp, Wallet, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  balance: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewChange: (view: "markets" | "portfolio") => void;
  activeView: "markets" | "portfolio";
}

export function Header({
  balance,
  searchQuery,
  onSearchChange,
  onViewChange,
  activeView,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-white">PredictX</span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            <Button
              variant={activeView === "markets" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("markets")}
              className="text-zinc-300 hover:text-white"
            >
              Markets
            </Button>
            <Button
              variant={activeView === "portfolio" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("portfolio")}
              className="text-zinc-300 hover:text-white"
            >
              Portfolio
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 border-zinc-700 bg-zinc-900 pl-9 text-zinc-200 placeholder:text-zinc-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
