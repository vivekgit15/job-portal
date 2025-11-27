const Application = require('../models/application.model')
const Job = require('../models/job.model');

// Apply for a job (jobseeker only)

const applyJob = async (req , res) =>{
    try {
        const jobId = req.params.jobId;
        const userId = req.user._id;

        const job = await Job.findById(jobId);
        if(!job) return res.status(404).json({message:"Job not found"});

        // Prevent employer from applying

            if(req.user.role === "employer") {
                return res.status(403).json({ message: "Employers cannot apply for jobs" });
            }
        // Check if already applied
        
        const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      employer: job.postedBy,
    });
    return res.status(201).json({ message: "Applied successfully", application });

    } catch (error) {
        console.error(error);
    return res.status(500).json({ message: "Server error" });
    }
}

// Get applications for jobseeker
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title location salary")
      .populate("employer", "name email");

    return res.json(apps);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get applicants for employer (per job)
const getApplicantsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const apps = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .populate("job", "title salary location");

    return res.json(apps);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { applyJob, getMyApplications, getApplicantsByJob };