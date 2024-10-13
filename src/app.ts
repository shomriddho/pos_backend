// src/app.ts
import express from 'express';
import { z } from 'zod';
import db from './db';
import redisClient from './redisClient';
import router from './routes';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);

app.get('/health', async (req, res) => {
  try {
    await redisClient.connect();
    await redisClient.set('healthcheck', 'OK');
    const redisStatus = await redisClient.get('healthcheck');
    await redisClient.disconnect();
    
    const [dbStatus] = await db.raw('SELECT 1+1 AS result');
    
    res.json({
      postgres: dbStatus ? 'OK' : 'Fail',
      redis: redisStatus || 'Fail',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong', details: 'Unknown error' });
    }
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
