import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import {
  CreatePaymentIntentDto,
  CreateCheckoutSessionDto,
  RetrievePaymentDto,
} from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('payment')
@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Public()
  @Get('get-price-id')
  @ApiOperation({ summary: 'Get Stripe price ID' })
  @ApiResponse({ status: 201, description: 'Successfully created Stripe price' })
  @ApiResponse({ status: 400, description: 'Failed to create Stripe price' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPriceId() {
    return this.paymentService.getPriceId();
  }

  @Public()
  @Post('create-session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout session created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create checkout session' })
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
    return this.paymentService.createCheckoutSession(createCheckoutSessionDto);
  }

  @Public()
  @Post('create-payment-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({ status: 200, description: 'Payment intent created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(createPaymentIntentDto);
  }

  @Public()
  @Get(':paymentId')
  @ApiOperation({ summary: 'Retrieve payment information' })
  @ApiResponse({ status: 200, description: 'Payment information retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async retrievePayment(@Param() params: RetrievePaymentDto) {
    return this.paymentService.retrievePayment(params);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook handled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const payload = req.rawBody || req.body;
    return this.paymentService.handleWebhook(payload, signature);
  }
}