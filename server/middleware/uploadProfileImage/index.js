const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kirub-rental/users", 
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill" }], 
  },
});

const uploadProfile = multer({ 
  storage: userStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

module.exports = uploadProfile;