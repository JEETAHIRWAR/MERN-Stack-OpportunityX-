import express from 'express';
import
{
    createApplication,
    getApplicationsByJobId,
    getApplicationById,
} from '../controllers/applicationController.js';
const router = express.Router();

router.route('/')
    .post(createApplication);

router.route('/job/:jobId')
    .get(getApplicationsByJobId);

router.route('/:id')
    .get(getApplicationById);

export default router;
