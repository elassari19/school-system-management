import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
});

// Initialize Prism ORM
export const prisma = new PrismaClient();

// Initialize Redis
export const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379'
);
