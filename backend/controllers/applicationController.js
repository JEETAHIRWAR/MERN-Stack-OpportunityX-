import Application from '../models/Application.js';

// Create a new application
export const createApplication = async (req, res) =>
{
    const { jobId, name, email } = req.body;
    try
    {
        const newApplication = new Application({
            jobId,
            name,
            email,
        });
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error)
    {
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
