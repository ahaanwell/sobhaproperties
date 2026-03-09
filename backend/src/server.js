import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("❌ Server error:", error);
      process.exit(1);
    });

    process.on("SIGINT", () => {
      console.log("🛑 Server shutting down...");
      server.close(() => process.exit(0));
    });

    process.on("SIGTERM", () => {
      console.log("🛑 Server terminated");
      server.close(() => process.exit(0));
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
