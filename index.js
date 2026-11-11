import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import AdminRouter from "./Routes/AdminRoute.js";
import photoRoutes from "./Routes/PostRoute.js";
dotenv.config();
await connectDB();
const app = express();
const port = process.env.port || 3000;
// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", AdminRouter);
app.use("/api", photoRoutes);

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
