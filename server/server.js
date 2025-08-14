const express = require("express");
const cors = require("cors");
const db = require("./models/index");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const user = require("./routes/users");
const fleet = require("./routes/fleets");
const booking = require("./routes/bookings");
const chappa = require("./routes/chappa");
const admin = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:3000",
  // "https://curious-life.vercel.app"
];

// 1.  Middleware for CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// 2. Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// 3. cookie parser
app.use(cookieParser());


// Logging middleware
app.use((req, res, next) => {
  console.log("\n=== New Request ===");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Synchronize the database
db.sequelize.sync().then(() => {
  console.log("DB has been re-synced");
});

// Routes
app.use("/kirub-rental/users", user);
app.use("/kirub-rental/fleets", fleet, booking);
app.use("/kirub-rental/chappa", chappa);
app.use("/kirub-rental/admin", admin);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});