import { Router } from 'express';
import {
  createPaymentIntent,
  retrievePayment,
  payemntIntentSignature,
  getPriceId,
  getPaymentSession,
} from './payment.controller';

const router = Router();

/**
 * @swagger
 * /api/payment/get-price-id:
 *   get:
 *     summary: Get Stripe price ID
 *     tags: [Payment]
 *     responses:
 *       201:
 *         description: Successfully created Stripe price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     priceId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     productId:
 *                       type: string
 *       400:
 *         description: Failed to create Stripe price
 *       500:
 *         description: Internal server error
 */
export const getStripePriceId = router.get('/get-price-id', getPriceId);

/**
 * @swagger
 * /api/payment/create-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - userId
 *             properties:
 *               email:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 url:
 *                   type: string
 *       500:
 *         description: Failed to create checkout session
 */
router.post('/create-session', getPaymentSession);

/**
 * @swagger
 * /api/payment/create-payment-intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - courseId
 *               - userId
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               courseId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid request
 */
router.post('/create-payment-intent', createPaymentIntent);

/**
 * @swagger
 * /api/payment/{paymentId}:
 *   get:
 *     summary: Retrieve payment information
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment information retrieved successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get('/:paymentId', retrievePayment);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Handle Stripe webhook events
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Webhook handled successfully
 *       400:
 *         description: Invalid webhook signature
 */
router.post('/payemnt-intent-signature', payemntIntentSignature);

export default router;
