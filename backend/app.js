require('dotenv').config();

const cors = require("cors"); 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

const Product = require("./models/product.js");
const path = require("path");
const User = require("./models/user.js");
const Cart = require("./models/Cart"); 


app.get('/favicon.ico', (req, res) => res.status(204).end());


app.use(cors({
    origin: ['http://localhost:5501', 'http://127.0.0.1:5501'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));


const sessionOptions = {
    secret: 'mysupersecretstring', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017/CampusBites',
        collectionName: 'sessions'
    }), 
    cookie: { 
        secure: false,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: 'lax'
    } 
};

app.use(session(sessionOptions));
app.use(flash());


//require routes
const userRouter = require("./routes/user.js");
const orderRouter = require("./routes/order.js");
const paymentRouter = require("./routes/payment.js");
const cartRouter = require("./routes/cart.js");

const { runInNewContext } = require("vm");



//establishing connection to database
main().then(()=>{
    console.log("connection to database is successful.");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/CampusBites");
};

//setting views engine
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

//to access static files
app.use(express.static("public"));
app.use('/css', express.static(path.join(__dirname, '/public/css')));

//middlewares
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname,"../frontend/user")));

//setting ejs engine
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
    console.log("Session user:", req.session.user); 
    res.locals.user = req.session.user || null;
    next();
});
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use((req, res, next) => {
    console.log("=== Session Debug ===");
    console.log("Session ID:", req.session.id);
    console.log("Session:", req.session);
    console.log("User in session:", req.session.user);
    console.log("User in request:", req.user);
    next();
});


app.post('/api/set-flash', (req, res) => {
    const { type, message } = req.body;
    if (type === 'success') {
        req.flash('success', message);
    } else if (type === 'error') {
        req.flash('error', message);
    }
    res.json({ success: true });
});

//User Authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure passport serialization
passport.serializeUser((user, done) => {
    console.log("Serializing user:", user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("Deserializing user ID:", id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId:", id);
            return done(null, null);
        }
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found for ID:", id);
            return done(null, null);
        }
        console.log("Found user:", user);
        done(null, user);
    } catch (err) {
        console.error("Error deserializing user:", err);
        done(err);
    }
});


app.use((req, res, next) => {
    if (req.session && req.session.user) {
        if (!mongoose.Types.ObjectId.isValid(req.session.user._id)) {
            console.log("Invalid user ID in session:", req.session.user._id);
            req.session.user = null;
        }
    }
    next();
});

passport.use(new LocalStrategy(User.authenticate()));

//using routes
app.use("/", userRouter);
app.use("/", orderRouter);
app.use("/", paymentRouter);
app.use("/", cartRouter);


//error handler
app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"} = err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

//api request for fetching menu data
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// Get current user 
app.get('/api/user/current', (req, res) => {
    console.log("Current user endpoint - Session user:", req.session.user); 
    if (req.session.user) {
        res.json({ 
            _id: req.session.user._id,
            username: req.session.user.username,
            email: req.session.user.email
        });
    } else {
        console.log("No user in session"); 
        res.status(401).json({ message: "Not authenticated" });
    }
});

//Fetch cart items
app.get("/api/cart", async (req, res) => {
    try {
        const cartItems = await Cart.find(); 
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
});

//add items to cart
app.post("/api/cart", async (req, res) => {
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

        // Check if cart already exists for the user
        let cart = await Cart.findOne({ userId: req.session.user._id });

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



//home route
app.get("/",(req,res)=>{
    res.render(path.join(__dirname, "../frontend/user/index.ejs"));
});


//setting and checking port
app.listen(port=5501,(req,res)=>{
    console.log(`app is listening to server ${port}.`);
});
