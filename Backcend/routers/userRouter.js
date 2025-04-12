import express from 'express';
import { createUser, getUser, updateUserDetails, deleteUserById, getAllUsers,changePassword } from '../controllers/userController.js';
import { login} from '../controllers/authController.js';


const router = express.Router();

router.get('/all/users', getAllUsers);

router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUserDetails);
router.delete('/:id', deleteUserById);
router.post('/login', login);
router.post('/change-password',changePassword)


export default router;
