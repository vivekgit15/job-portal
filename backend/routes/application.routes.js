const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const { applyJob, getMyApplications, getApplicantsByJob , updateApplicationStatus} = require("../controllers/application.controller");

// Jobseeker applies
router.post("/apply/:jobId", protect, applyJob);

// Jobseeker sees his own applications
router.get("/my", protect, getMyApplications);

// Employer sees applicants for job
router.get("/job/:jobId", protect, getApplicantsByJob);
router.put("/status/:applicationId", protect, updateApplicationStatus);


module.exports = router;
