const Job = require("../models/job.model");

const createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary, employmentType } = req.body;

    if (req.user.role !== "employer")
      return res.status(403).json({ message: "Only employers can post job" });

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      salary,
      employmentType,
      postedBy: req.user._id,
    });

    return res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    return res.json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to update this job" });

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this job" });

    await job.deleteOne();
    return res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
