const express = require("express");
const cors = require("cors");

const app = express();


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
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};


// CORS first
app.use(cors(corsOptions));
app.use((req,res,next)=>{

res.header(
"Access-Control-Allow-Origin",
"https://shopnow-frontend-sable.vercel.app"
);

res.header(
"Access-Control-Allow-Credentials",
"true"
);

next();

});

// Manual preflight
app.use((req, res, next) => {

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Origin",
      "https://shopnow-frontend-sable.vercel.app"
    );

    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,PATCH,OPTIONS"
    );

    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return res.sendStatus(200);
  }

  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended:true }));