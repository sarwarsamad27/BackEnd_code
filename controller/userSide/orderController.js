const Order = require("../../models/userSide/orderModel");
const nodemailer = require("nodemailer");
const ProductDetail = require("../../models/companySide/productDetailModel");
const ComProfile = require("../../models/companySide/comFormModel");

// ✅ Order create + Email send (User + Company) — no auth
exports.createOrder = async (req, res) => {
  try {
    const { userId, name, email, phone, city, postalCode, address, products } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "❌ Products are required" });
    }

    // ✅ order create in DB (save as "userId", not "user")
    const order = await Order.create({
      userId,
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

        // ✅ add product with image for summary
        productListHtml += `
          <li style="margin-bottom:15px;list-style:none;">
            <img src="${dbProduct.images[0]}" alt="${dbProduct.productName}" 
                 style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-right:10px;"/>
            <b>${dbProduct.productName}</b><br/>
            Qty: ${item.quantity}<br/>
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
              <img src="${dbProduct.images[0]}" 
                   alt="${dbProduct.productName}" 
                   style="width:120px;height:120px;object-fit:cover;border-radius:8px;"/>
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

// ✅ user ke orders get — no auth
// ✅ user ke orders get by userId
exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }

    // Step 1: get orders
    const orders = await Order.find({ userId })
      .populate({
        path: "products.product",
        populate: [
          { path: "user", select: "email" }, // base User
          { path: "brand", select: "productName" }, // brand info
        ],
      })
      .sort({ createdAt: -1 });

    // Step 2: attach seller profile info (name, image, etc.)
    const ordersWithSeller = await Promise.all(
      orders.map(async (order) => {
        const productsWithSeller = await Promise.all(
          order.products.map(async (p) => {
            if (p.product?.user?._id) {
              const sellerProfile = await ComProfile.findOne({
                user: p.product.user._id,
              }).lean();

              if (sellerProfile) {
                return {
                  ...p.toObject(),
                  seller: {
                    name: sellerProfile.name,
                    email: sellerProfile.email,
                    image: sellerProfile.image
                      ? `${req.protocol}://${req.get("host")}/${sellerProfile.image.replace(/\\/g, "/")}`
                      : null,
                  },
                };
              }
            }
            return p;
          })
        );

        return {
          ...order.toObject(),
          products: productsWithSeller,
        };
      })
    );

    res.json({ count: ordersWithSeller.length, orders: ordersWithSeller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
