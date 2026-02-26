import { Router } from "express";
import pool from "../lib/db";
import redis from "../lib/redis";

const router = Router();
const BAD_REQUEST = 400;

router.get("/", async (req, res) => {
  const { product_id, quantity } = req.body;

  const client = await pool.connect();

  try {
    // get product
    const paramsToGetProducts = [product_id];
    const { rows } = await client.query(
      "SELECT * FROM products where id= $1",
      paramsToGetProducts,
    );
    const [product] = rows;

    // check de stock
    const stockIsNotEnough = !product || product.stock < quantity;

    if (stockIsNotEnough) {
      return res.status(BAD_REQUEST).json({
        error: "Stock is Not Enough",
      });
    }

    // deduct stock quantity inside the product
    const paramsToUpdateProduct = [quantity, product_id];
    await client.query(
      "UPDATE products SET stock = stock - $1 where id = $2",
      paramsToUpdateProduct,
    );

    // INSERT A NEW ROW INSIDE THE order
    const totalCents = product.price_cents * quantity; // value

    const orderResponse = await client.query(
      "INSERT INTO orders  (product_id, quantity, total_cents) VALUES ($1, $2, $3) RETURNING *",
    );
  } catch (error) {
    // DO SOMETHING
  } finally {
    client.release();
  }
});

export default router;
