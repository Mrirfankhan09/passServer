import express from 'express';
import { Signup, Login, isAuthenticated, Logout } from '../controller/authController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.get('/logout',Logout)
router.get("/me", isAuthenticated, (req, res) => {
    // If the code reaches this point, the user is authenticated
    // The user object is usually available on req.user after authentication middleware runs
    res.status(200).json({
        user: {
            id: req.user.id,
            email: req.user.email
            // add other user properties you want to expose to the frontend
        }
        
    });
});

export default router;