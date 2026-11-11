import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// ── Prevent accidental client-side bundling ─────────────────────────────
// Cloudinary API secret must NEVER reach the browser.
if (typeof window !== "undefined") {
  throw new Error("cloudinary config must only be imported server-side");
}

// ── Required env vars ───────────────────────────────────────────────────
const requiredConfig = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingConfig = requiredConfig.filter((key) => !process.env[key]?.trim());

if (missingConfig.length > 0) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missingConfig.join(", ")}`,
  );
}

// ── Configure once ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
