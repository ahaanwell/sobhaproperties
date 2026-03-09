// 404 Not Found Handler
export const notFoundHandler = (req, res, next) => {
  // Only 404 for API routes — let static files pass through
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `Route ${req.path} not found`
    })
  }
  next()
}

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((e) => e.message).join(", ");
    statusCode = 400;
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
