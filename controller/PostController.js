import Post from "../model/PostModel.js";
import cloudinary from "../config/claudinaryConfig.js";
// import authenticateAdmin from "../middleWare/authenticateAdmin.js";
import logger from "../utils/Logger.js";

/**
 * Create a new post:
 * 1. Validate request body and uploaded file
 * 2. Upload image buffer to Cloudinary
 * 3. Save post (author + Cloudinary public_id + url) to MongoDB
 * 4. Roll back Cloudinary upload if DB save fails
 */
export const createPost = async (req, res) => {
  logger.warn("Controller endpoint hit...");
  let uploadedImage;
  try {
    const { name, event } = req.body ?? {};
    const photoUrl = req.files?.photoUrl?.[0];

    if (!name || !event || !photoUrl) {
      return res.status(400).json({
        success: false,
        message: "Include name, event, and photoUrl in the multipart form data",
      });
    }

    uploadedImage = await cloudinary.uploader.upload(photoUrl.path, {
      resource_type: "image",
      background_removal: "cloudinary_ai",
    });

    const post = new Post({
      name,
      event,
      photoPublicId: uploadedImage.public_id,
      photoUrl: uploadedImage.secure_url,
    });
    await post.save();
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        logger.error("Failed to clean up uploaded post image", cleanupError);
      }
    }
    logger.error("Failed to create post", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

// get all post

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    logger.error("Failed to fetch posts", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
}