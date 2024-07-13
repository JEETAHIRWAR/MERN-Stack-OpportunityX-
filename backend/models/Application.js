import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
