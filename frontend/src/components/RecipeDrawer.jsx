import { useState } from "react";

const RecipeDrawer = ({ recipe, onClose }) => {
  const [expandTime, setExpandTime] = useState(false);

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-xl border-l p-4 overflow-y-auto z-50">
      <button className="mb-4 text-red-500 font-bold hover:cursor-pointer" onClick={onClose}>
        Close X
      </button>
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <h3 className="text-gray-600 mb-4">{recipe.cuisine}</h3>

      <p className="mb-2">
        <b>Description:</b> {recipe.description}
      </p>

      <p className="mb-2">
        <b>Total Time:</b> {recipe.total_time} mins{" "}
        <button
          onClick={() => setExpandTime(!expandTime)}
          className="ml-2 text-blue-500 underline hover:cursor-pointer"
        >
          {expandTime ? "Hide" : "Expand"}
        </button>
      </p>
      {expandTime && (
        <div className="ml-4">
          <p>Prep Time: {recipe.prep_time} mins</p>
          <p>Cook Time: {recipe.cook_time} mins</p>
        </div>
      )}

      <h4 className="text-lg font-semibold mt-4 mb-2">Nutrients</h4>
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          {Object.entries(recipe.nutrients || {}).map(([k, v]) => (
            <tr key={k}>
              <td className="border p-2 capitalize">{k}</td>
              <td className="border p-2">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeDrawer;
