import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

export const stripe = new Stripe(process.env.Secret_key);
