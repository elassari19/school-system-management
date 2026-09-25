import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { RedisService } from './common/redis/redis.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({ client: redisService as any }),
      secret: process.env.SECRET_KEY || 'j809898nbbbhf76v65c4cuj',
      saveUninitialized: false,
      resave: false,
      name: 'sessionId',
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 86400 * 30,
        sameSite: 'lax',
      },
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('v1/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription('API documentation for School Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();