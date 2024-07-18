import express from 'express';
import
{
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    incrementViewCount,
} from '../controllers/jobController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(authMiddleware, createJob);

router.route('/jobs/:id')
    .get(getJobById)
    .put(authMiddleware, updateJob)
    .delete(authMiddleware, deleteJob);

router.route('/jobs/:id/view')
    .put(incrementViewCount);

export default router;
