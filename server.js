require("dotenv").config(); // sab se upar

const app = require("./src/app");
const { connectDB } = require("./src/config/database");

let isConnected = false;

const initDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("DB Connected");
    } catch (error) {
      console.error("DB Connection Failed:", error.message);
    }
  }
};


initDB();


if (process.env.NODE_ENV !== "production") {

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}


module.exports = app;