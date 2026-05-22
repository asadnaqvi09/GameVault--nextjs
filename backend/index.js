import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.config.js';
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(helmet());

app.get('/', (req,res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the game server'
    })
})
app.use('/api/v1/auth', authRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})