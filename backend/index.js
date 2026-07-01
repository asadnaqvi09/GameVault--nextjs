import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import connectDB from './src/config/db.config.js';
import { appConfig } from './src/config/app.config.js';
import apiRoutes from './src/routes/index.js';
import { notFound, errorHandler } from './src/shared/middlewares/errorHandler.middleware.js';
import { expireStaleOrders } from './src/modules/orders/services/order.service.js';

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cors({
  origin: appConfig.clientUrl,
  credentials: true,
}));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the GameVault API server'
  });
});

app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
  expireStaleOrders().catch(() => {});
  setInterval(() => {
    expireStaleOrders().catch(() => {});
  }, 60 * 60 * 1000);
});
