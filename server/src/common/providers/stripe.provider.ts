import { Provider } from '@nestjs/common';
import Stripe from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

export const StripeProvider: Provider = {
  provide: STRIPE_CLIENT,
  useFactory: () => {
    return new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
      apiVersion: '2024-06-20',
    });
  },
};