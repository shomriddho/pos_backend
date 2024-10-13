// src/routes.ts
import { Router } from 'express';
import { z } from 'zod';
import db from './db';

const router = Router();

const productSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
});

router.post('/products', async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const { name, price } = validatedData;
    
    await db('products').insert({ name, price });
    
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});
export default router;
