import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const use_cart_store = create((set, get) => ({
  cart: [],
  total: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotal();
    } catch (error) {
      console.log(error);

      set({ cart: [] });
    }
  },

  clearCart: async () => {
    await axios.delete("cart/delete-cart");
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );

        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });

      get().calculateTotal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete("/cart", { data: { productId } });

      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));

      get().calculateTotal();
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await get().removeFromCart(productId);
        return;
      }

      await axios.put(`/cart/${productId}`, { quantity });

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));

      get().calculateTotal();
      toast.success("Quantity updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  calculateTotal: () => {
    const { cart } = get();

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    set({ total });
  },
}));

export default use_cart_store;
