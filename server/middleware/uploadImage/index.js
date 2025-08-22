const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kirub-rental/cars",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], 
  },
});

const upload = multer({ storage });

module.exports = upload;
