import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const server = express();
import crypto from 'crypto';
import userRoutes from './routes/userRoute.js';
import passwordRoutes from './routes/passwordRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import cookieParser from 'cookie-parser';

// console.log(crypto.randomBytes(32).toString('hex'));




//middlewares

server.use(cors(
    {
        origin: ['http://localhost:5173', 'https://passserver.onrender.com','https://passwmg.netlify.app'],
        credentials: true,
    }
));
server.use(bodyParser.json());
server.use(cookieParser())
// console.log("Server is running");
//routes
server.use('/api/auth', userRoutes);
server.use('/api/passwords', passwordRoutes);
server.use('/api/activity', activityRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

const startServer = async () => {
    try {
        await connectDB();
        server.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();





