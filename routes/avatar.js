const express = require("express");
const multer = require("multer");
const upload = require("../middleware/avatarUpload");
const {
  uploadAvatarPhoto,
  getAvatarPhoto,
} = require("../controllers/avatarController");

const router = express.Router();

// Upload avatar API
router.post("/avatar/upload", upload.single("avatar"), uploadAvatarPhoto);

// Retrieve avatar API
router.get("/avatar/:id", getAvatarPhoto);

module.exports = router;
