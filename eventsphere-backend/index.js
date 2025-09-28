const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const qrRoutes = require("./routes/qrRoutes");
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Simple CORS fix for Railway deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api/qr", qrRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connection successful" });
});

app.get("/", (req, res) => res.send("EventSphere Backend Running"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`Backend running at: ${process.env.NODE_ENV === 'production' ? 'Railway' : 'localhost'}:${PORT}`);
});