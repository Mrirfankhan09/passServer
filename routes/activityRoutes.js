import express from 'express';
import Activity from '../models/Activity.js';
import { isAuthenticated } from '../controller/authController.js';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {

    try {
        const user = req.user.userId;
        // req.user.id comes from your auth middleware
        const activities = await Activity.find({ userId: user })
            .sort({ timestamp: -1 }) // latest first
            .limit(5);              // only 5 most recent

        res.status(200).json(activities);
    } catch (err) {
        console.error("Error fetching recent activities:", err);
        res.status(500).json({ message: "Server error" });
    }

});

export default router;