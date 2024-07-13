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

router.route('/:id')
    .get(getJobById)
    .put(authMiddleware, updateJob)
    .delete(authMiddleware, deleteJob);

router.route('/:id/view')
    .put(incrementViewCount);

export default router;
