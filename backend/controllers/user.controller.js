const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

// --------------------------------------------------
// Get Logged-In User Profile
// --------------------------------------------------
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------
// Update Profile
// --------------------------------------------------
exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------
// Upload Profile Photo (Cloudinary)
// --------------------------------------------------
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const file = req.files.photo.tempFilePath;

    const upload = await cloudinary.uploader.upload(file, {
      folder: "jobportal/profile"
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: upload.secure_url },
      { new: true }
    );

    res.json({ message: "Photo uploaded", url: upload.secure_url, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// --------------------------------------------------
// Upload Resume (Cloudinary)
// --------------------------------------------------
exports.uploadResume = async (req, res) => {
  try {
    const file = req.files.resume.tempFilePath;

    const upload = await cloudinary.uploader.upload(file, {
      folder: "jobportal/resumes",
      resource_type: "raw"
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: upload.secure_url },
      { new: true }
    );

    res.json({ message: "Resume uploaded", url: upload.secure_url, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume upload failed" });
  }
};
