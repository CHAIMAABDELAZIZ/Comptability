import express from 'express';
import { createequip, fetchAllEquipments,updateEquipDetails,deleteEquipById, getEquip,getEquipementsByUsername } from '../controllers/equipController.js';

const router = express.Router();

router.get('/all/equip', fetchAllEquipments); // Define the route to fetch all equipment
router.post('/', createequip);
router.put('/:id', updateEquipDetails);  // Update equipment by ID
router.delete('/:id', deleteEquipById);  // Delete equipment by ID
router.get('/:id', getEquip);
router.get('/user/:username', getEquipementsByUsername); 


export default router;