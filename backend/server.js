

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connctCloudinary from "./config/cloudnary.js";
import AddminRouter from "./routes/AddminRoutes.js"; // ✅ Correctly imported
import doctorRoutes from "./routes/DocterRoutes.js";
import UserRoute from "./routes/UserRoutes.js"
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB & Cloudinary
connectDB();
connctCloudinary();

// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // ✅ Ensure form-data parsing
app.use(cors());

// API Test Route
app.get("/", (req, res) => {
    res.send("API is running successfully");
});

// ✅ Ensure correct route registration
app.use("/api/admin", AddminRouter);
app.use("/api/doctors",doctorRoutes);
app.use("/api/user",UserRoute);

// Start Server
app.listen(port, () => {
    console.log(`Server is running successfully at http://localhost:${port}`);
});
