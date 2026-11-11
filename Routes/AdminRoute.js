import { Router } from "express";
import express from "express";
import { createAdmin,loginUser } from "../controller/Admin.js";
const AdminRouter = express.Router();

AdminRouter.post("/create-admin", createAdmin);
AdminRouter.post("/login", loginUser);

export default AdminRouter;