const Application = require("../models/application.model");
const Job = require("../models/job.model");
const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

// =========================================
// Apply for a Job (Jobseeker Only)
// =========================================
const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    let resumeUrl = "";
    let resumeId = "";

    // 1️⃣ If NEW resume uploaded
    if (req.files?.resume) {
      const file = req.files.resume.tempFilePath;

      const upload = await cloudinary.uploader.upload(file, {
        folder: "jobportal/applications",
        resource_type: "raw",
      });

      resumeUrl = upload.secure_url;
      resumeId = upload.public_id;

    } else {
      // 2️⃣ Use EXISTING resume
      const user = await User.findById(userId);
      resumeUrl = user.resume;
      resumeId = user.resumeId;

      if (!resumeUrl) {
        return res.status(400).json({
          message: "You do not have a resume uploaded. Please upload one.",
        });
      }
    }

    // 3️⃣ Check job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // 4️⃣ Prevent employers from applying
    if (req.user.role === "employer") {
      return res.status(403).json({ message: "Employers cannot apply." });
    }

    // 5️⃣ Prevent duplicate apply
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // 6️⃣ Create Application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      employer: job.postedBy,
      resume: resumeUrl,
      resumeId: resumeId,
      status: "pending",
      appliedAt: new Date(),
    });

    return res.status(201).json({
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =========================================
// Get Applications for Jobseeker
// =========================================
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title location salary")
      .populate("employer", "name email")
      .sort({ appliedAt: -1 })
      .select("job employer status appliedAt resume");

    return res.json(apps);

  } catch (error) {
    console.error("Get My Applications Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =========================================
// Get Applicants for Employer (Per Job)
// =========================================
const getApplicantsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const apps = await Application.find({ job: jobId })
      .populate("applicant", "name email profilePhoto")
      .populate("job", "title salary location")
      .sort({ appliedAt: -1 });

    return res.json(apps);

  } catch (error) {
    console.error("Get Applicants Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(applicationId);

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    // Only the employer who posted the job can update status
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    application.status = status;
    await application.save();

    return res.json({
      message: `Applicant marked as ${status}`,
      application,
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { applyJob, getMyApplications, 
getApplicantsByJob ,
updateApplicationStatus
};
