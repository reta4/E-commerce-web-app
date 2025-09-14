import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
// import axios from "axios";
const use_product_store = create((set) => ({
  products: [],
  loading: false,
  set_products: (products) => set({ products }),
  create_products: async (product_data) => {
    set({ loading: true });

    try {
      const res = await axios.post("/products", product_data);
      set((prev_state) => ({
        products: [...prev_state.products, res.data],
        loading: false,
      }));
      set({ loading: false });

      console.log(res);
      toast.success("congratulation product created & published");
    } catch (err) {
      console.log(err);
      toast.error("there are some issue, try again");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");

      set({ products: res.data.products, loading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      console.log(error);
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      const { data } = res;
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
    }
  },
}));

export default use_product_store;
