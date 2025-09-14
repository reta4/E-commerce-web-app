import Product from "../model/Products.js";

export const add_to_cart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existing_item = user.cartItems.find((item) => item.id === productId);
    if (existing_item) {
      existing_item.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.status(201).send(user.cartItems);
  } catch (err) {
    console.log("error from add to cart" + err);

    res.status(500).send({ "server error": err });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
      res.status(201).send(user.cartItems);
    }

    await user.save();
  } catch (err) {
    res.status(500).send({ "server error": err });
  }
};
export const deleteAll = async (req, res) => {
  try {
    const user = req.user;
    user.cartItems = [];
    await user.save();
  } catch (err) {
    res.status(500).send({ "server error": err });
  }
};

export const get_cart_products = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );

      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.status(200).send(cartItems);
  } catch (err) {
    console.log({ "error from get_cart_products controller": err });
    res.status(500).send({ "server error": err });
  }
};

export const update_quantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existing_item = user.cartItems.find((item) => item.id === id);

    if (!existing_item) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (quantity <= 0) {
      // remove item if quantity is 0 or negative
      user.cartItems = user.cartItems.filter((item) => item.id !== id);
    } else {
      // update quantity
      existing_item.quantity = quantity;
    }

    await user.save();
    res.status(200).send(user.cartItems);
  } catch (err) {
    console.error("Error from update_quantity controller:", err);
    res.status(500).send({ error: "Server error", details: err.message });
  }
};
