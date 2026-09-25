import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../common/entities/payment.entity';
import { Parent } from '../common/entities/parent.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeProvider } from '../common/providers/stripe.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Parent])],
  controllers: [PaymentController],
  providers: [PaymentService, StripeProvider],
  exports: [PaymentService],
})
export class PaymentModule {}