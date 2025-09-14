import use_cart_store from "../stores/use_cart_store";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
//..............................................................................
const stripePromise = loadStripe(
  "pk_test_51RxjprRXZC9mBgoRDfp0dtriNLqkZichb64H9BQWfSwnB9Ax4bT2fuQodvMB9Ru0saYZkAJFfYfC6KUHJPT3Cb5l00VXNfcRjH"
);

const OrderSummary = () => {
  const { total, cart } = use_cart_store();
  const formattedTotal = total.toFixed(2);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/payment/create-checkout-session", {
      products: cart,
    });

    const session = res.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6">
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handlePayment}
        >
          Proceed to Checkout
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

//"pk_test_51RxjprRXZC9mBgoRDfp0dtriNLqkZichb64H9BQWfSwnB9Ax4bT2fuQodvMB9Ru0saYZkAJFfYfC6KUHJPT3Cb5l00VXNfcRjH"
