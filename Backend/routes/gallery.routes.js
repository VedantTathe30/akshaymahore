console.log("✅ gallery.routes.js loaded");

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  getGallery,
  addImage,
  updateImage,
  deleteImage,
} = require("../controllers/galleryController");

const router = express.Router();

// ✅ Ensure the uploads/clinic directory exists
const clinicDir = path.join(__dirname, "../uploads/clinic");
if (!fs.existsSync(clinicDir)) {
  fs.mkdirSync(clinicDir, { recursive: true });
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, clinicDir); // Save inside uploads/clinic
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Routes
router.get("/", getGallery);
router.post("/", upload.single("image"), addImage);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("✅ Gallery route working");
});

module.exports = router;
