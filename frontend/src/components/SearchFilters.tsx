import { useSearchParams } from "react-router-dom";
import { Category } from "../types";
import { X } from "lucide-react";

interface SearchFiltersProps {
  categories: Category[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ categories }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    category ||
    minPrice ||
    maxPrice ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => updateFilters("category", e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => updateFilters("minPrice", e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => updateFilters("maxPrice", e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => updateFilters("sortBy", e.target.value)}
            className="input"
          >
            <option value="createdAt">Newest First</option>
            <option value="name">Name A-Z</option>
            <option value="price">Price</option>
          </select>
        </div>

        {/* Sort Order */}
        {sortBy === "price" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => updateFilters("sortOrder", e.target.value)}
              className="input"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
