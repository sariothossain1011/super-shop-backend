const OrderModel = require("../models/OrderModel");

const braintree = require("braintree");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



exports.getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.userId })
      .populate("products", "-photo")
      .populate("buyer", "name");
    return res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    return res.status(500).json({ status: "fail", data: error.toString() });
  }
};

exports.allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.toString() });
  }
};

exports.getToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, response) {
      if (error) {
        res.status(400).json({ status: "fail", data: error.toString() });
      } else {
        res.status(200).json({ status: "success", data: response });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.toString() });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          // create order
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.userId,
          }).save();
          // decrement quantity
          decrementQuantity(cart);
          res.status(200).json({ ok: true });
        } else {
          res.status(500).json({ status: "fail", data: error.toString() });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.toString() });
  }
};

const decrementQuantity = async (cart) => {
  try {
    // build mongodb query
    const bulkOps = cart.map((item) => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -0, sold: +1 } },
        },
      };
    });

    const updated = await Product.bulkWrite(bulkOps, {});
    console.log("blk updated", updated);
  } catch (error) {
    console.log(error);
  }
};

exports.orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("buyer", "email name");
    // send email
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: order.buyer.email,
      subject: "Order status",
      html: `
          <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
          <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details</p>
        `,
    };
    try {
      await sgMail.send(emailData);
    } catch (error) {
      res.status(500).json({ status: "fail", data: error.toString() });
    }

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.toString() });
  }
};
