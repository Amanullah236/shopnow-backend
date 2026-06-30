const { Sequelize } = require("sequelize");

// Force pg load
try {
  require("pg");
} catch (e) {
  console.error("pg not found:", e.message);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected");
    await sequelize.sync({ force: false });
    console.log("✅ Database synced");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Error:", error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
