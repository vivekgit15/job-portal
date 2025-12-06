const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z ]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["jobseeker", "employer"],
    default: "jobseeker",
  },
//  NEW PROFILE FIELDS (Jobseeker)
  phone: {
    type: Number,
    default: "",
    min: 10,
    max: 13,
  },

  skills: {
    type: [String],
    default: [],
  },
  bio: {
     type: String,
      default: "" 
    
    },
  experience: { 
    type: String,
     default: "" 

  },
  education: {
     type: String,
     default: "" 
  },
  profilePhoto: { 
    type: String, 
    default: "" 
  }, // Cloudinary URL
  profilePhotoId :String,
  resume: { 
    type: String, 
    default: "" 
  }, // Cloudinary URL
  resumeId : String,

  // EMPLOYER FIELDS
  companyName: { type: String, default: "" },
  companyWebsite: { type: String, default: "" },
  companyDescription: { type: String, default: "" },
  companyLogo: { type: String, default: "" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
