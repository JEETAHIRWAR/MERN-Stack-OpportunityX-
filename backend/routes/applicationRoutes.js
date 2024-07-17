import express from 'express';
import
{
    createApplication,
    getApplicationsByJobId,
    getApplicationById,
    checkApplicationStatus,
} from '../controllers/applicationController.js';
const router = express.Router();

router.route('/')
    .post(createApplication);

router.route('/job/:jobId')
    .get(getApplicationsByJobId);

router.route('/:id')
    .get(getApplicationById);

router.route('/check/:jobId').get(checkApplicationStatus);

export default router;
