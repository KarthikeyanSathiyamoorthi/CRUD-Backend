const express = require("express");
const multer = require("multer");
const upload = require("../middleware/avatarUpload");
const {
  uploadAvatarPhoto,
  getAvatarPhoto,
  deleteAvatarPhoto,
} = require("../controllers/avatarController");

const router = express.Router();

// Upload avatar API
router.post("/avatar/upload", upload.single("avatar"), uploadAvatarPhoto);

// Retrieve avatar API
router.get("/avatar/:id", getAvatarPhoto);

// DELETE API - Delete a Todo
router.delete("/avatar/delete/:id", deleteAvatarPhoto);

module.exports = router;
