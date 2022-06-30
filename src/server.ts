import express, { Application } from 'express';
import { Server } from 'http';
import connectDb from './config/db';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import cors from 'cors';
import path from 'path';
import sanitizedConfig from './config';

dotenv.config({
  path: path.resolve(__dirname, '/.env'),
});

connectDb();

const app: Application = express();

if (sanitizedConfig.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT: number | string = sanitizedConfig.PORT || 1337;

const server: Server = app.listen(PORT, () =>
  console.log(
    `🟢 Server running in ${sanitizedConfig.NODE_ENV} mode on port ${PORT}`
  )
);
