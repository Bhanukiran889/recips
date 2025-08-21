// src/api/recipes.js
import axiosInstance from "./axiosInstance";

// Fetch paginated recipes
export const getRecipes = async (page = 1, limit = 15) => {
  const res = await axiosInstance.get(`/api/recipes?page=${page}&limit=${limit}`);
  return res.data;
};

// Search recipes
export const searchRecipes = async ({ title = "", cuisine = "", rating = "" }) => {
  const res = await axiosInstance.get(
    `/api/recipes/search?title=${title}&cuisine=${cuisine}&rating=${rating}`
  );
  return res.data;
};

// Get single recipe by ID
export const getRecipeById = async (id) => {
  const res = await axiosInstance.get(`/api/recipes/${id}`);
  return res.data;
};
