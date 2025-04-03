const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Cart = require("../models/Cart");
const { isLoggedIn } = require("../middleware");
const Order = require("../models/order.js");
const Payment = require("../models/payment.js");
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post("/api/create-order", isLoggedIn, async (req, res) => {
    try {
        console.log("Creating order for user:", req.user._id); // Debug log

        const cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        console.log("Found cart:", cart); // Debug log

        if (!cart || cart.items.length === 0) {
            console.log("Cart is empty"); // Debug log
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Calculate total amount including GST
        const subtotal = cart.totalPrice;
        const gst = subtotal * 0.18;
        const totalAmount = Math.round((subtotal + gst) * 100); // Convert to paise

        console.log("Calculated amount:", { subtotal, gst, totalAmount }); // Debug log

        // Check if Razorpay credentials are set
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay credentials not configured"); // Debug log
            throw new Error("Razorpay credentials not configured");
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: totalAmount,
            currency: "INR",
            receipt: `order_${Date.now()}`,
            payment_capture: 1,
            notes: {
                userId: req.user._id.toString(),
                cartId: cart._id.toString()
            }
        });

        console.log("Created Razorpay order:", order); // Debug log

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Error creating order:", error); // Debug log
        console.error("Error stack:", error.stack); // Debug log
        res.status(500).json({ 
            message: "Error creating order", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Verify payment
router.post("/api/verify-payment", isLoggedIn, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log("=== Payment Verification Debug ===");
        console.log("Received payment data:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
        console.log("User ID:", req.user._id);

        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        console.log("Signature verification:", {
            received: razorpay_signature,
            expected: expectedSign,
            matches: razorpay_signature === expectedSign
        });

        if (razorpay_signature === expectedSign) {
            console.log("Payment signature verified successfully");

            // Get cart items
            const cart = await Cart.findOne({ userId: req.user._id })
                .populate('items.productId');

            console.log("Found cart:", cart);

            if (!cart || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            // Calculate total amount including GST
            const subtotal = cart.totalPrice;
            const gst = subtotal * 0.18;
            const totalAmount = subtotal + gst;

            console.log("Amount calculation:", { subtotal, gst, totalAmount });

            // Create order
            const order = new Order({
                userId: req.user._id,
                items: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price
                })),
                totalAmount: totalAmount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: 'confirmed'
            });

            // Save order
            await order.save();
            console.log("Order saved successfully:", order);

            // Record payment in database
            console.log("Creating payment record...");
            const payment = new Payment({
                userId: req.user._id,
                orderId: order._id,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amount: totalAmount,
                currency: 'INR',
                status: 'success',
                paymentMethod: 'card',
                paymentDetails: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    amount: totalAmount,
                    currency: 'INR'
                }
            });

            console.log("Payment object created:", payment);

            try {
                const savedPayment = await payment.save();
                console.log("Payment saved successfully:", savedPayment);
                
                // Verify payment was saved
                const verifyPayment = await Payment.findById(savedPayment._id);
                console.log("Verified payment in database:", verifyPayment);
            } catch (saveError) {
                console.error("Error saving payment:", saveError);
                throw saveError;
            }

            // Clear cart
            await Cart.findOneAndDelete({ userId: req.user._id });
            console.log("Cart cleared successfully");

            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            console.error("Payment signature verification failed");
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("=== Payment Verification Error ===");
        console.error("Error details:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            success: false, 
            message: "Error verifying payment", 
            error: error.message 
        });
    }
});

// Display user payments
router.get("/payments", isLoggedIn, async (req, res) => {
    try {
        console.log("=== Payment History Debug ===");
        console.log("Session:", req.session);
        console.log("User from session:", req.session.user);
        console.log("User from request:", req.user);
        console.log("User ID:", req.user._id);

        if (!req.user || !req.user._id) {
            console.error("No user found in request");
            req.flash("error", "Please login to view payment history");
            return res.redirect("/login");
        }

        // First, check if there are any payments in the database
        const allPayments = await Payment.find({});
        console.log("Total payments in database:", allPayments.length);
        console.log("All payments:", allPayments);

        // Now fetch user's payments
        const userPayments = await Payment.find({ userId: req.user._id })
            .populate({
                path: 'orderId',
                populate: {
                    path: 'items.productId',
                    select: 'name price'
                }
            })
            .sort({ createdAt: -1 });

        console.log("Found payments for user:", userPayments.length);
        console.log("User payments:", userPayments);

        // Ensure we're passing the data correctly to the view
        const viewData = {
            title: "Payment History",
            payments: userPayments || [],
            user: req.user,
            debug: {
                paymentsLength: userPayments ? userPayments.length : 0,
                userId: req.user._id,
                paymentsData: userPayments,
                sessionUser: req.session.user,
                requestUser: req.user
            }
        };

        console.log("Data being passed to view:", viewData);
        res.render("users/payments", viewData);
    } catch (error) {
        console.error("=== Payment History Error ===");
        console.error("Error fetching payments:", error);
        console.error("Error stack:", error.stack);
        req.flash("error", "Failed to fetch payment history");
        res.redirect("/");
    }
});

// Test route to check payments collection
router.get("/test-payments", async (req, res) => {
    try {
        console.log("=== Testing Payments Collection ===");
        
        // Check if Payment model is defined
        console.log("Payment model:", Payment);
        
        // Get all payments
        const allPayments = await Payment.find({});
        console.log("All payments in database:", allPayments);
        
        // Get payments count
        const count = await Payment.countDocuments();
        console.log("Total payments count:", count);
        
        res.json({
            success: true,
            message: "Payments collection test completed",
            totalPayments: count,
            payments: allPayments
        });
    } catch (error) {
        console.error("Error testing payments collection:", error);
        res.status(500).json({
            success: false,
            message: "Error testing payments collection",
            error: error.message
        });
    }
});

module.exports = router;
