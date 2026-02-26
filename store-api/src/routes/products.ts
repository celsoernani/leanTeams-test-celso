import { Router } from "express";
import pool from "../lib/db";
import redis from "../lib/redis";

const router = Router();

const REDIS_KEY_PRODUCTS = "products:all";
const SIXTY_SECONDS = 60;

router.get("/", async (req, res) => {
  const { category } = req.query;

  if (!category) {
    const cached = await redis.get(REDIS_KEY_PRODUCTS);

    if (cached) return res.json(JSON.parse(cached));
  }

  let query = "SELECT * FROM products";

  const params = [];

  if (category) {
    query += "WHERE category = $1";
    params.push(category);
  }

  const { rows } = await pool.query(query, params);

  if (!category) {
    const cachedString = JSON.stringify(rows);
    await redis.setex(REDIS_KEY_PRODUCTS, SIXTY_SECONDS, cachedString);
  }

  res.json(rows);
});

export default router;
