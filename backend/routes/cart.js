const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/product.js");

// Get cart items for current user
router.get("/cart", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const cart = await Cart.findOne({ userId: req.session.user._id });
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
});

// Add items to cart
router.post("/cart", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { items } = req.body;
        console.log("Received items:", items);

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }

        
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
            }
        }

        let cart = await Cart.findOne({ userId: req.session.user._id });

        if (cart) {
            items.forEach((newItem) => {
                const existingItem = cart.items.find(
                    (item) => item.productId.toString() === newItem.productId
                );

                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    cart.items.push(newItem);
                }
            });
        } else {
            cart = new Cart({ 
                userId: req.session.user._id, 
                items 
            });
        }

        await cart.save();
        res.status(201).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("Cart error:", error);
        res.status(500).json({ message: "Error adding items to cart", error });
    }
});

module.exports = router;
