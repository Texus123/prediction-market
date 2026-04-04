import { Category } from "../types/market";
import { Button } from "@/components/ui/button";

const categories: Category[] = [
  "All",
  "Politics",
  "Crypto",
  "Sports",
  "Tech",
  "Science",
  "Entertainment",
  "Finance",
];

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={
            activeCategory === category
              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
