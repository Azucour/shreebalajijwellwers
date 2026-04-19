const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// @route POST /api/upload/images
// @desc  Upload multiple images to Cloudinary
// @access Private
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/upload/image/:public_id
// @desc  Delete image from Cloudinary
// @access Private
router.delete('/image/:public_id', protect, async (req, res) => {
  try {
    const public_id = decodeURIComponent(req.params.public_id);
    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
