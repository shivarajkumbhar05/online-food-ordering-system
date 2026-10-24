const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_DB_URI;
  if (!uri) throw new Error("MONGO_URI is not set");

  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
