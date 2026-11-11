import express from "express";
import { createPost, getAllPost } from "../controller/PostController.js";
import upload from "../utils/uploadMiddleware.js";
import authenticateAdmin from "../middleWare/authenticateAdmin.js";
const photoRoutes = express.Router();
const requireMultipart = (req, res, next) => {
  if (!req.is("multipart/form-data")) {
    return res.status(415).json({
      success: false,
      message: "Send name, event, and image1 as multipart/form-data fields",
    });
  }

  return next();
};

photoRoutes.post(
  "/create-post",
  authenticateAdmin,
  requireMultipart,
  upload.fields([{ name: "photoUrl", maxCount: 1 }]),
  createPost,
);

photoRoutes.get("/get-post",getAllPost)
export default photoRoutes;
