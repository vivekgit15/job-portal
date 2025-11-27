const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");

const { 
  getMyProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResume
} = require("../controllers/user.controller");

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);
router.post("/upload-photo", protect, uploadProfilePhoto);
router.post("/upload-resume", protect, uploadResume);

module.exports = router;
