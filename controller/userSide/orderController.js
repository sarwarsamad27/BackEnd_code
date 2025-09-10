const Order = require("../../models/userSide/orderModel");
const nodemailer = require("nodemailer");
const ProductDetail = require("../../models/companySide/productDetailModel");
const ComProfile = require("../../models/companySide/comFormModel");

// ✅ Order create + Email send (User + Company)
exports.createOrder = async (req, res) => {
  try {
    const { name, email, phone, city, postalCode, address, products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "❌ Products are required" });
    }

    // ✅ order create in DB
    const order = await Order.create({
      user: req.user.id,
      name,
      email,
      phone,
      city,
      postalCode,
      address,
      products,
      status: "For Verify", // default status
    });

    // ✅ fetch product details
    const productIds = products.map((p) => p.product);
    const dbProducts = await ProductDetail.find({ _id: { $in: productIds } }).populate("user");

    let totalAmount = 0;
    let productListHtml = "<ul>";

    // ✅ loop products
    for (let item of products) {
      const dbProduct = dbProducts.find((p) => p._id.toString() === item.product);
      if (dbProduct) {
        const subtotal = dbProduct.price * item.quantity;
        totalAmount += subtotal;

        productListHtml += `
          <li>
            ${dbProduct.productName}  
            (Qty: ${item.quantity}) - 
            Price: ${dbProduct.price} x ${item.quantity} = <b>${subtotal}</b>
          </li>`;

        // ✅ company ko mail bhejna
        const companyProfile = await ComProfile.findOne({ user: dbProduct.user._id });
        if (companyProfile && companyProfile.email) {
          const companyMailOptions = {
            from: `"My Shop" <${process.env.EMAIL_USER}>`,
            to: companyProfile.email,
            subject: `📦 New Order Received for ${dbProduct.productName}`,
            html: `
              <h2>Hello ${companyProfile.name},</h2>
              <p>You have received a new order for your product <b>${dbProduct.productName}</b>.</p>
              <h3>🛒 Order Details:</h3>
              <ul>
                <li>Customer: ${name} (${email})</li>
                <li>Phone: ${phone}</li>
                <li>Address: ${address}, ${city}, ${postalCode}</li>
                <li>Quantity: ${item.quantity}</li>
                <li>Total Paid: ${subtotal}</li>
              </ul>
              <hr>
              <p>Please process this order from your dashboard.</p>
            `,
          };
          await transporter.sendMail(companyMailOptions);
        }
      }
    }
    productListHtml += "</ul>";

    // ✅ Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ user ko mail bhejna
    const userMailOptions = {
      from: `"My Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Thank You for Your Order",
      html: `
        <h2>Thank you for your order, ${name}!</h2>
        <p>We have received your order and will process it soon.</p>
        <h3>🛒 Order Summary:</h3>
        ${productListHtml}
        <p><b>Total Amount: ${totalAmount}</b></p>
        <p><b>Delivery Address:</b><br>
        ${address}, ${city}, ${postalCode}</p>
        <p>📞 ${phone}</p>
        <hr>
        <p>We’ll notify you once your order is shipped.</p>
        <p>Regards,<br/>My Shop Team</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    res.status(201).json({ message: "✅ Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ user ke orders get
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.product");
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
