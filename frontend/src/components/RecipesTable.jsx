import { useState, useEffect } from "react";
import { getRecipes, searchRecipes } from "../api"; // using API functions
import RecipeDrawer from "./RecipeDrawer";
import Filters from "./Filters";
import StarRating from "./StarRating";

const RecipesTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let data;
      let searchMode = false;

      // Use API helper functions
      if (filters.title || filters.cuisine || filters.rating) {
        data = await searchRecipes(filters);
        searchMode = true;
      } else {
        data = await getRecipes(page, limit);
      }

      setRecipes(data.data || []);
      setTotal(data.total || data.data?.length || 0);
      setIsSearchMode(searchMode);
    } catch (err) {
      console.error("Error fetching recipes", err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const renderFallback = () => {
    if (loading) return <p>Loading...</p>;
    if (recipes.length === 0 && isSearchMode) {
      return (
        <p className="text-gray-500">No results found for your search.</p>
      );
    }
    if (recipes.length === 0 && !isSearchMode) {
      return (
        <p className="text-gray-500">
          No data available. Please add recipes.
        </p>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Table or Fallback */}
      {recipes.length === 0 ? (
        renderFallback()
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Cuisine</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Total Time</th>
              <th className="border p-2">Serves</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr
                key={r._id || r.id} // safer than index
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedRecipe(r)}
              >
                <td className="border p-2 truncate max-w-[200px]">{r.title}</td>
                <td className="border p-2">{r.cuisine}</td>
                <td className="border p-2">
                  <StarRating value={r.rating} />
                </td>

                <td className="border p-2">
                  {r.total_time || r.totalTime} mins
                </td>
                <td className="border p-2">{r.serves || r.noOfPeople}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {recipes.length > 0 && (
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:cursor-pointer"
          >
            Prev
          </button>
          <span>
            Page {page} of {Math.ceil(total / limit) || 1}
          </span>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Results per page */}
      {recipes.length > 0 && (
        <div className="mt-2">
          <label>Results per page: </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border p-2 rounded hover:cursor-pointer"
          >
            {[15, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Drawer */}
      {selectedRecipe && (
        <RecipeDrawer
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default RecipesTable;
