import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      total_cents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query("DELETE FROM orders");
  await pool.query("DELETE FROM products");

  await pool.query(`
    INSERT INTO products (name, description, price_cents, stock, category) VALUES
    ('Wireless Headphones',    'Premium noise-cancelling headphones', 8999,  14, 'electronics'),
    ('Mechanical Keyboard',    'Compact TKL with RGB lighting',       15999,  8, 'electronics'),
    ('Wireless Mouse',         'Ergonomic, 3-month battery life',      3999, 22, 'electronics'),
    ('Running Shoes',          'Lightweight, breathable upper',       12999,  5, 'apparel'),
    ('Yoga Mat',               'Non-slip, 6mm thick',                  3499, 30, 'fitness'),
    ('Resistance Bands Set',   'Set of 5 resistance levels',           1999, 40, 'fitness'),
    ('Backpack',               '30L waterproof hiking pack',           7499, 11, 'accessories'),
    ('Water Bottle',           'Insulated, keeps cold 24h',            2999, 35, 'accessories'),
    ('Coffee Grinder',         'Burr grinder, 15 grind settings',      6999,  7, 'kitchen'),
    ('Desk Lamp',              'LED, adjustable colour temperature',   4599, 18, 'kitchen')
  `);

  console.log("✅ Seeded products");
  await pool.end();
}

seed().catch(console.error);
