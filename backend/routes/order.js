const express = require("express");
const router = express.Router();
const Order = require("../models/order.js");
const { isLoggedIn } = require("../middleware");

// Debug route to check user authentication
router.get("/debug-auth", (req, res) => {
    console.log("Debug auth - User:", req.user);
    console.log("Debug auth - Session:", req.session);
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        session: req.session
    });
});

// Get user's orders - Changed from /orders to /order to match the navigation link
router.get("/order", isLoggedIn, async (req, res) => {
    try {
        console.log("=== Order Route Debug ===");
        console.log("User ID:", req.user._id);
        console.log("User:", req.user);
        console.log("Session:", req.session);
        
        // First, let's check if there are any orders in the database
        const allOrders = await Order.find({});
        console.log("Total orders in database:", allOrders.length);
        console.log("All orders:", allOrders);

        // Now fetch user's orders
        const orders = await Order.find({ userId: req.user._id })
            .populate({
                path: 'items.productId',
                select: 'name price imageUrl' // Select only the fields we need
            })
            .sort({ createdAt: -1 });

        console.log("Found orders for user:", orders.length);
        console.log("User orders:", orders);

        // Pass orders to the view
        res.render("users/orders", { 
            orders: orders || [], // Ensure orders is always an array
            user: req.user // Pass user data to the view
        });
    } catch (error) {
        console.error("=== Order Route Error ===");
        console.error("Error fetching orders:", error);
        console.error("Error stack:", error.stack);
        req.flash("error", "Failed to fetch orders");
        res.redirect("/");
    }
});

// Add a test route to verify the router is working
router.get("/test-orders", (req, res) => {
    res.send("Orders route is working!");
});

module.exports = router;
