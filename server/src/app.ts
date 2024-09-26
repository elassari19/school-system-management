import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import sessionMiddelware from './middelwares/session.middelware';
import { User } from '@prisma/client';
import LocalStrategy from 'passport-local';
import { prisma } from './utils/configs';
import { compare } from 'bcryptjs';

/* ROUTE IMPORTS */
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import { getStripePriceId } from './routes/payment.route';

export const creatApp = () => {
  /* CONFIGURATIONS */
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.use(morgan('common'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(sessionMiddelware);

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  /* ROUTES */
  app.use('/v1/api/auth', authRouter);
  app.use('/v1/api/user', userRouter);
  app.use('/v1/api', getStripePriceId);

  return app;
};
