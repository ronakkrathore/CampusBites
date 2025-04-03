const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Cart = require("../models/Cart");
const Product = require("../models/product");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res)=>{
    try{
        let {username,email,phone_no,password} = req.body;
        const newUser = new User({username,email,phone_no});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to CampusBites!");
        res.redirect("/");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", (req, res, next) => {
    // Check if the request is JSON
    const isJsonRequest = req.headers['content-type'] === 'application/json';
    
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            if (isJsonRequest) {
                return res.status(500).json({ message: "Authentication error" });
            }
            req.flash("error", "Authentication error");
            return res.redirect("/login");
        }
        
        if (!user) {
            if (isJsonRequest) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            req.flash("error", "Invalid credentials");
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                if (isJsonRequest) {
                    return res.status(500).json({ message: "Login error" });
                }
                req.flash("error", "Login error");
                return res.redirect("/login");
            }

            
            req.session.user = {
                _id: user._id,
                username: user.username,
                email: user.email
            };

            
            req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);
                    if (isJsonRequest) {
                        return res.status(500).json({ message: "Session save failed" });
                    }
                    req.flash("error", "Session save failed");
                    return res.redirect("/login");
                }
                
                if (isJsonRequest) {
                    return res.json({ 
                        message: "Login successful",
                        user: {
                            _id: user._id,
                            username: user.username,
                            email: user.email
                        }
                    });
                }
                
                req.flash("success", "Welcome back!");
                return res.redirect("/");
            });
        });
    })(req, res, next);
});


router.get("/orders", isLoggedIn, (req, res) => {
    res.render("users/orders.ejs");
});

// Display cart page
router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');
        
        res.render("cart/cart", { cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        req.flash("error", "Failed to load cart");
        res.redirect("/");
    }
});

// Get cart items API
router.get("/api/cart", isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
});

// Add items to cart API
router.post("/api/cart", isLoggedIn, async (req, res) => {
    try {
        const { items } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }

        // Validate all product IDs exist
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
            }
        }

        // Check if cart already exists for the user
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            // Update existing cart
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
            // Create a new cart for the user
            cart = new Cart({ 
                userId: req.user._id, 
                items 
            });
        }

        // Calculate total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        res.status(201).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("Cart error:", error);
        res.status(500).json({ message: "Error adding items to cart", error });
    }
});


router.put("/api/cart/items/:itemId", isLoggedIn, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { change } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const newQuantity = item.quantity + change;
        if (newQuantity < 1) {
            return res.status(400).json({ message: "Quantity cannot be less than 1" });
        }

        item.quantity = newQuantity;
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        res.json({ message: "Quantity updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity", error });
    }
});

// Remove item from cart API
router.delete("/api/cart/items/:itemId", isLoggedIn, async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        res.json({ message: "Item removed successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error });
    }
});

router.get("/payments", isLoggedIn, (req, res) => {
    res.render("users/payments.ejs");
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/");
    });
});

module.exports = router;
