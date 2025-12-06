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


// Upload Profile Photo (Cloudinary)

exports.uploadProfilePhoto = async (req, res) => {
  try {

    if (!req.files?.photo)
      return res.status(400).json({ message: "No file uploaded" });

    // 1. Get OLD photo id BEFORE uploading the new one
    const oldUser = await User.findById(req.user._id);
    const oldPhotoId = oldUser.profilePhotoId;

    const file = req.files.photo.tempFilePath;

    // 2. Upload new photo
    const upload = await cloudinary.uploader.upload(file, {
      folder: "jobportal/profile"
    });

    // 3. Update user with NEW photo
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePhoto: upload.secure_url,
        profilePhotoId: upload.public_id,
      },
      { new: true }
    );

    // 4. Delete OLD photo (not the new one)
    if (oldPhotoId) {
      await cloudinary.uploader.destroy(oldPhotoId);
    }

    res.json({ message: "Photo uploaded", url: upload.secure_url, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};


// Delete Profile Photo (Cloudinary)

  exports.deleteProfilePhoto = async (req,res) => {
        try {
          const user = await User.findById(req.user._id);

          if(!user.profilePhotoId) return res.status(400).json({ message: "No photo to delete" });

          await cloudinary.uploader.destroy(user.profilePhotoId);

          user.profilePhoto = "";
          user.profilePhotoId = "";
          await user.save();

          res.json({ message: "Profile photo deleted", user });

        } catch (error) {
            res.status(500).json({ message: "Delete failed" });
        }
  }





// Upload Resume (Cloudinary)

exports.uploadResume = async (req, res) => {
  try {

    if (!req.files?.resume)
      return res.status(400).json({ message: "No file uploaded" });

    const file = req.files.resume.tempFilePath;

    const upload = await cloudinary.uploader.upload(file, {
      folder: "jobportal/resumes",
      resource_type: "raw"
    });

    const userData = await User.findById(req.user._id);
        if(userData.resumeId){
          await cloudinary.uploader.destroy(userData.resumeId, {
            resource_type:'raw',
          })
        }
    

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: upload.secure_url,
        resumeId:upload.public_id,
       },
      { new: true }
    );

    res.json({ message: "Resume uploaded", url: upload.secure_url, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume upload failed" });
  }
};


// Delete Resume (Cloudinary)

exports.deleteResume = async (req,res) =>{
  try {
      const user = await User.findById(req.user._id);

      if(!user.resumeId)  return res.status(400).json({ message: "No resume to delete" });

      await cloudinary.uploader.destroy(user.resumeId , {
        resource_type:'raw'
      });

      user.resume= "";
      user.resumeId ="";
      await user.save();

 res.json({ message: "Resume deleted", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};