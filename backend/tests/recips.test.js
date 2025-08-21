// tests/recipes.test.js
const request = require("supertest");
const app = require("../server"); // import your Express app
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Recipes API", () => {
  // Test GET /api/recipes (pagination + sorting)
  it("should return paginated recipes sorted by rating", async () => {
    const res = await request(app).get("/api/recipes?page=1&limit=5");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body).toHaveProperty("total");
    expect(res.body.data[0]).toHaveProperty("title");
    expect(res.body.data[0]).toHaveProperty("rating");
  });

  // Test GET /api/recipes/search by title
  it("should return recipes that match title query", async () => {
    const res = await request(app).get("/api/recipes/search?title=pie");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].title.toLowerCase()).toContain("pie");
    }
  });

  // Test GET /api/recipes/search by cuisine
  it("should filter recipes by cuisine", async () => {
    const res = await request(app).get("/api/recipes/search?cuisine=Southern Recipes");
    expect(res.statusCode).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].cuisine).toBe("Southern Recipes");
    }
  });

  // Test GET /api/recipes/search by rating filter
  it("should filter recipes by rating >= 4.5", async () => {
    const res = await request(app).get("/api/recipes/search?rating=>=4.5");
    expect(res.statusCode).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].rating).toBeGreaterThanOrEqual(4.5);
    }
  });

  // Test GET /api/recipes/search by total_time filter
  it("should filter recipes by total_time <= 120", async () => {
    const res = await request(app).get("/api/recipes/search?total_time=<=120");
    expect(res.statusCode).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].total_time).toBeLessThanOrEqual(120);
    }
  });

  // Test fallback (no results)
  it("should return empty array if no match", async () => {
    const res = await request(app).get("/api/recipes/search?title=nonexistentfood");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});
