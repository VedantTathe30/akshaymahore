const Gallery = require("../models/galleryModel");

// Get all images
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new image
exports.addImage = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file ? `/uploads/clinic/${req.file.filename}` : req.body.imageUrl;
    const newImage = new Gallery({ imageUrl, caption });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update image caption
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    const updated = await Gallery.findByIdAndUpdate(id, { caption }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
