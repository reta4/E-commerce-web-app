import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
//..............................................................
dotenv.config();
//..............................................................
import authRoutes from "./route/auth_route.js";
import productsRoutes from "./route/products_routes.js";
import cart_routh from "./route/cart_route.js";
import payment_routh from "./route/payment_routh.js";
import analytics_routh from "./route/analytics_routh.js";
import orders_routh from "./route/orders_routh.js";
//..............................................................
//db connection:
import { connectDB } from "./lib/db.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//..............................................................
//routs:
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cart_routh);
app.use("/api/payment", payment_routh);
app.use("/api/analytics", analytics_routh);
app.use("/api/orders", orders_routh);
//..............................................................
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
});
