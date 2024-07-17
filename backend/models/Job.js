import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    applyLink: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
    applicationStartDate: { type: String, default: "Not mentioned" },
    applicationEndDate: { type: String, default: "Not mentioned" },
    category: { type: String, required: true },
    experience: { type: String, enum: ["Fresher", "Experienced"], required: true },
    jobType: { type: String, enum: ["Work from Home", "In Office"], required: true },
    createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', JobSchema);
export default Job;
