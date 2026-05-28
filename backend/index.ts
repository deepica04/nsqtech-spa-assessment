import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import recordRoutes from './routes/records';
import adminRoutes from './routes/admin';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'NSQTech API is running' });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log('🚀 Server running on http://localhost:' + PORT));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default app;
