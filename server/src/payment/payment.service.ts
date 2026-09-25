import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../common/entities/payment.entity';
import { Parent } from '../common/entities/parent.entity';
import { CreatePaymentIntentDto, CreateCheckoutSessionDto, RetrievePaymentDto } from './dto/payment.dto';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '../common/entities/enums';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_API_KEY')!, {
      apiVersion: '2024-06-20',
    });
  }

  async getPriceId() {
    const product = await this.stripe.products.create({
      name: 'school fees',
      description: 'monthly school fees',
    });
    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: 10000,
      currency: 'usd',
    });

    if (!price || !price.id) {
      throw new Error('Failed to create Stripe price');
    }

    return {
      success: true,
      data: {
        priceId: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        productId: price.product,
      },
    };
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: this.configService.get('STRIPE_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.get('CLIENT_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/cancel`,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: createCheckoutSessionDto.email,
      metadata: {
        userId: createCheckoutSessionDto.userId,
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const { amount, currency, courseId, userId } = createPaymentIntentDto;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { courseId, userId },
    });

    if (!paymentIntent?.client_secret) {
      throw new Error('Failed to create payment intent');
    }

    return { clientSecret: paymentIntent.client_secret };
  }

  async retrievePayment(retrievePaymentDto: RetrievePaymentDto) {
    const { paymentId } = retrievePaymentDto;

    const payment = await this.stripe.paymentIntents.retrieve(paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET')!;

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { client_secret, userId } = paymentIntent.metadata;

      try {
        const payment = await this.paymentRepository.findOne({
          where: { signatureId: client_secret },
        });

        if (payment) {
          payment.status = PaymentStatus.PAID;
          await this.paymentRepository.save(payment);
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }

    return { received: true };
  }

  async createPaymentRecord(parentId: string, signatureId: string): Promise<Payment> {
    const payment = this.paymentRepository.create({
      parentId,
      signatureId,
      status: PaymentStatus.PENDING,
    });
    return this.paymentRepository.save(payment);
  }
}