import Order from "../model/order.model.js";

export const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const orders = await Order.find({ user: id });

      if (orders) {
        res.status(200).send({ orders });
      }
    } else {
      res.status(404).send("user by this id not found");
    }
  } catch (err) {
    console.log(err);
  }
};
