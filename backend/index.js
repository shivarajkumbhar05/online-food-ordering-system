// Application entry point (single server for all routes).
const path = require("path");
require("dotenv").config({
  path: [path.resolve(__dirname, ".env"), path.resolve(__dirname, "../.env")],
});

const dns = require("dns");
// Only override DNS when explicitly asked (e.g. DNS_SERVERS=1.1.1.1,8.8.8.8 for Atlas SRV
// lookups on restrictive networks). Forcing public resolvers breaks container hostnames.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()));
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const errorMiddleware = require("./middlewares/errorMiddleware");

// ---- config checks -------------------------------------------------------
const missing = [];
if (!process.env.MONGO_URI && !process.env.MONGO_DB_URI) missing.push("MONGO_URI");
if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 5000;

// ---- app -----------------------------------------------------------------
const app = express();
app.set("trust proxy", 1); // running behind nginx / a platform load balancer

const origins = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors(origins.length ? { origin: origins } : undefined)); // no CORS_ORIGIN => allow all (dev)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check for Docker / load balancers
app.get("/health", (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({ status: dbUp ? "ok" : "db_unavailable", uptime: process.uptime() });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const routes = {
  auth: "./routes/authRoutes",
  admin: "./routes/adminRoutes",
  cart: "./routes/cartRoutes",
  menu: "./routes/menuRoutes",
  orders: "./routes/orderRoutes",
  payment: "./routes/paymentRoutes",
  restaurants: "./routes/restaurantRoutes",
  users: "./routes/userRoutes",
};
for (const [name, file] of Object.entries(routes)) {
  app.use(`/api/${name}`, require(file));
}
app.use("/auth", require(routes.auth)); // legacy path used by older frontend builds

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorMiddleware);

// ---- start / stop --------------------------------------------------------
let server;
connectDB()
  .then(() => {
    server = app.listen(port, "0.0.0.0", () =>
      console.log(`Server running on port ${port} (${isProd ? "production" : "development"})`)
    );
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); // let Docker / the platform restart us
  });

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  const done = () => mongoose.connection.close(false).finally(() => process.exit(0));
  server ? server.close(done) : done();
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
