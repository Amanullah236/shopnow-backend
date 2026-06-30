const express = require("express");
const cors = require("cors");

const app = express();


app.use(
  cors({
    origin: function (origin, callback) {

      const allowedOrigins = [
        "https://shopnow-frontend-sable.vercel.app",
        "http://localhost:5173"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }

    },
    credentials: true
  })
);


// IMPORTANT
app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({extended:true}));


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



app.get("/api/health",(req,res)=>{
 res.json({
  success:true,
  message:"Server running"
 })
});


module.exports = app;