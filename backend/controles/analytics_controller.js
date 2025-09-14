import Order from "../model/order.model.js";
import Product from "../model/Products.js";
import User from "../model/User.js";
//..............................................................

export const get_analytics_data = async (req, res) => {
  try {
    const total_users = await User.countDocuments();
    const total_products = await Product.countDocuments();

    const sale_data = await Order.aggregate([
      {
        $group: {
          _id: null,
          total_sales: { $sum: 1 },
          total_revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { total_sales, total_revenue } = sale_data[0] || {
      total_sales: 0,
      total_revenue: 0,
    };

    res.status(200).send({
      analytics_data: {
        users: total_users,
        products: total_products,
        revenue: total_revenue,
        sales: total_sales,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
