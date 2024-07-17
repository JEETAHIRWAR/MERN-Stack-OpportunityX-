import Application from '../models/Application.js';

// Create a new application
export const createApplication = async (req, res) =>
{
    const { jobId, name, email } = req.body;
    try
    {

        // Check if the user has already applied
        const existingApplication = await Application.findOne({ jobId, email });
        if (existingApplication)
        {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        const newApplication = new Application({
            jobId,
            name,
            email,
        });
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error)
    {
        res.status(501).json({ error: 'Error submitting application' });
        res.status(500).json({ message: 'Server error' });
    }
};

// Get applications for a specific job
export const getApplicationsByJobId = async (req, res) =>
{
    try
    {
        const applications = await Application.find({ jobId: req.params.jobId });
        res.status(200).json(applications);
    } catch (error)
    {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single application by ID
export const getApplicationById = async (req, res) =>
{
    try
    {
        const application = await Application.findById(req.params.id);
        if (!application)
        {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(application);
    } catch (error)
    {
        res.status(500).json({ message: 'Server error' });
    }
};



export const checkApplicationStatus = async (req, res) =>
{
    const { jobId } = req.params;
    const { email } = req.query; // Get user email from query parameters
    try
    {
        const application = await Application.findOne({ jobId, email });
        const hasApplied = !!application;
        res.json({ hasApplied });
    } catch (error)
    {
        res.status(500).json({ error: 'Error checking application status' });
    }
};