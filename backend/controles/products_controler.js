import { redis } from "../lib/redis.js";
import Product from "../model/Products.js";
import cloudinary from "../lib/cloudinary.js";
//..............................................................

import dotenv from "dotenv";

dotenv.config();
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (Product) {
      res.status(200).json({ products });
    } else {
      res.status(200).send({ message: "there is no products" });
    }
  } catch (err) {
    res.status(500).send({ message: "server error", error: err.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).send({ message: "no featured products found" });
    }
    //store in redis feature quick access:
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res.status(200).send(featuredProducts);
  } catch (err) {
    console.log("error from getFeaturedProducts:" + err);
    res.status(500).send({ message: "server error ", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).send(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const public_id = product.image.split("/").pop().split(".")[0]; //get id of image
      try {
        await cloudinary.uploader.destroy(`products/${public_id}`);
        console.log("delete image from cloudinary");
      } catch (err) {
        console.log(err);
      }
      await Product.findByIdAndDelete(req.params.id);
      return res.status(201).send("product deleted successfully");
    } else {
      return res.status(404).send("product not found");
    }
  } catch (err) {
    console.log("error  from delete product" + err);
    res.status(500).send({ "server error": err });
  }
};

export const getReconditionsProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _od: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ "error  from server": err });
  }
};

export const getProductsbycategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ "server error": err });
  }
};

export const toggle_featuredProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedproduct = await product.save();
      await updated_featured_products_cache();
      res.status(201).send(updatedproduct);
    } else {
      res.status(404).send({ message: "product not found" });
    }
  } catch (err) {
    res.status(500).send({ "server error": err.message });
  }
};

async function updated_featured_products_cache() {
  try {
    const featured_products = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featured_products));
  } catch (err) {
    console.log("error come from updated_featured_products_cache " + err);
  }
}
