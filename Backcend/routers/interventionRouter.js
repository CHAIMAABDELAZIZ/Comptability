import express from 'express';
import {
    addIntervention,
    getInterventionById,
    updateIntervention,
    deleteIntervention,
    getInterventionsByUserId,
    getAllInterventions
} from '../controllers/interventionController.js';

const router = express.Router();

router.post('/', addIntervention);
router.get('/:id', getInterventionById);
router.put('/:id', updateIntervention);
router.delete('/:id', deleteIntervention);
router.get('/user/:userId', getInterventionsByUserId);
router.get('/all/interventions', getAllInterventions);


export default router;