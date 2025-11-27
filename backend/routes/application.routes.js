const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const { applyJob, getMyApplications, getApplicantsByJob } = require("../controllers/application.controller");

// Jobseeker applies
router.post("/apply/:jobId", protect, applyJob);

// Jobseeker sees his own applications
router.get("/my", protect, getMyApplications);

// Employer sees applicants for job
router.get("/job/:jobId", protect, getApplicantsByJob);

module.exports = router;
