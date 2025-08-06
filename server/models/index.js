require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === "development") {
  // Local development (exact format you requested)
  sequelize = new Sequelize(process.env.DB_URL_DEVELOPMENT, {
    dialect: "postgres",
    logging: console.log, 
  });
} else {
  // Production (Neon)
  sequelize = new Sequelize(process.env.DB_URL_PRODUCTION, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false, // Disable logging in production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

sequelize
  .authenticate()
  .then(() => {
    const dbType =
      process.env.NODE_ENV === "development"
        ? "localhost PostgreSQL"
        : "Neon PostgreSQL";
    console.log(`Connected to ${dbType} successfully!`);
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

// ===== Model Definitions =====
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models (your existing structure)
db.users = require('../models/users')(sequelize, DataTypes);
db.fleets = require('../models/fleets')(sequelize, DataTypes);

// ===== Database Sync =====
const initializeDB = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Development database synced with model changes");
    } else {
      console.log("Production database connected (no auto-sync)");
    }
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

initializeDB();

module.exports = db;