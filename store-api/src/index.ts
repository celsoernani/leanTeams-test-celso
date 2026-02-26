import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/orders", productsRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
