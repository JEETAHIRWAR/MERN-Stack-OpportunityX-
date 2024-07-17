import Job from '../models/Job.js';

// Create a new job posting
export const createJob = async (req, res) =>
{
    const { title, description, company, location, applyLink, applicationStartDate, applicationEndDate, category, experience, jobType } = req.body;
    try
    {
        const job = new Job({
            title,
            description,
            company,
            location,
            applyLink,
            applicationStartDate,
            applicationEndDate,
            category,
            experience,
            jobType,
            createdAt: Date.now(),
        });
        await job.save();
        res.status(201).json(job);
    } catch (error)
    {
        // console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job', error });
    }
};


// Get all job postings
export const getJobs = async (req, res) =>
{
    try
    {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error)
    {
        // console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};


// Get a single job posting by ID
export const getJobById = async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const job = await Job.findById(id);
        if (!job)
        {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error)
    {
        // console.error('Error fetching job by ID:', error);
        res.status(500).json({ message: 'Error fetching job by ID', error });
    }
};

export const updateJob = async (req, res) =>
{
    try
    {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob)
        {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(updatedJob);
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

export const deleteJob = async (req, res) =>
{
    try
    {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob)
        {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const incrementViewCount = async (req, res) =>
{
    try
    {
        const job = await Job.findById(req.params.id);
        if (!job)
        {
            return res.status(404).json({ message: 'Job not found' });
        }
        job.viewCount += 1;
        const updatedJob = await job.save();
        res.status(200).json(updatedJob);
    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};