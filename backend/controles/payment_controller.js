import { stripe } from "../lib/stripe.js";
import Order from "../model/order.model.js";
import dotenv from "dotenv";
//..............................................................

dotenv.config();
export const create_ceckout_session = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    res.status(200).send({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (err) {
    console.log("error from payment rout" + err);
    res.status(500).send({ "error from payment routh": err });
  }
};

export const checkout_success = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const products = JSON.parse(session.metadata.products);
      const new_order = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        payment_intent: session.payment_intent,
        stripe_session_id: sessionId,
      });
      await new_order.save();
      res.status(200).send({
        success: true,
        message: "payment successful, order created",
        orderId: new_order.id,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ "server error": err });
  }
};
