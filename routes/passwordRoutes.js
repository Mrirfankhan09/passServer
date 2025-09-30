import express from 'express';
import { addPassword,getpasswordById,updatePassword,deletePassword, getAllPasswords} from '../controller/passwordController.js';
import { isAuthenticated } from '../controller/authController.js';
import { isatty } from 'tty';
import { get } from 'http';

const router = express.Router();

router.post('/add',isAuthenticated, addPassword);
router.get('/decrypt/:id',isAuthenticated, getpasswordById);
router.put('/:id', isAuthenticated, updatePassword);
router.delete('/:id', isAuthenticated, deletePassword);
router.get('/',isAuthenticated,getAllPasswords);

export default router;