import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../utils/configs';

dotenv.config();
// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
});

export const getPriceId = async (req: Request, res: Response) => {
  try {
    const product = await stripe.products.create({
      name: 'school fees',
      description: 'monthly school fees',
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 10000,
      currency: 'usd',
    });

    if (!price || !price.id) {
      return res.status(400).json({ error: 'Failed to create Stripe price' });
    }

    res.status(201).json({
      success: true,
      data: {
        priceId: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        productId: price.product,
      },
    });
  } catch (error) {
    // @ts-ignore
    console.error('Error in getPriceId:', error.raw.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentSession = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: req.body.email, // Assuming email is sent in the request body
      metadata: {
        userId: req.body.userId, // Assuming userId is sent in the request body
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency, courseId, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { courseId, userId },
    });

    if (paymentIntent?.client_secret) {
    }

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const payemntIntentSignature = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { client_secret, userId } = paymentIntent.metadata;

    try {
      //   await prisma.payment.update({
      //     where: { signatureId: client_secret, studentId: userId },
      //     data: { status: 'PAID' },
      //   });
      // Additional logic for successful payment (e.g., sending confirmation email)
    } catch (error) {
      console.error('Error updating course payment status:', error);
    }
  }

  res.json({ received: true });
};

export const retrievePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await stripe.paymentIntents.retrieve(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
