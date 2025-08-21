const Filters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-4">
      {/* Title filter */}
      <input
        type="text"
        placeholder="Search by Title"
        value={filters.title}
        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        className="border p-2 rounded"
      />

      {/* Cuisine filter */}
      <input
        type="text"
        placeholder="Cuisine"
        value={filters.cuisine}
        onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        className="border p-2 rounded"
      />

      {/* Rating filter */}
      <select
        value={filters.rating}
        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">Rating</option>
        <option value=">=4">≥ 4</option>
        <option value=">=3">≥ 3</option>
        <option value="<=2">≤ 2</option>
      </select>
    </div>
  );
};

export default Filters;
