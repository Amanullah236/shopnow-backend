const express = require("express");
const cors = require("cors");

const app = express();


// CORS CONFIG
const corsOptions = {
  origin: [
    "https://shopnow-frontend-sable.vercel.app",
    "http://localhost:5173",
  ],

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],
};


// Apply CORS first
app.use(cors(corsOptions));


// Preflight
app.options("*", cors(corsOptions));


// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);


// Health
app.get("/api/health", (req,res)=>{
  res.status(200).json({
    success:true,
    message:"Server is running"
  });
});


// Error
app.use((req,res)=>{
  res.status(404).json({
    success:false,
    message:"Route not found"
  });
});


app.use((err,req,res,next)=>{
  console.log(err);

  res.status(500).json({
    success:false,
    message:"Server Error"
  });
});


module.exports = app;