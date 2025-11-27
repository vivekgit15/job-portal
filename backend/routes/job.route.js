const {createJob , getAllJobs , getJobById , updateJob , deleteJob} = require('../controllers/job.controller')
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');

router.post('/create', protect, createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);   // <-- FIXED
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
