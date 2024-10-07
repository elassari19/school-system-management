import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import sessionMiddelware from '../middelwares/session.middelware';

/* ROUTE IMPORTS */
import authRouter from './auth/auth.route';
import userRouter from './user/user.route';
import subjectRouter from './subject/subject.route';
import { getStripePriceId } from './payment/payment.route';
import { errorHandler, notFound } from '../middelwares';

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
  app.use('/v1/api/subject', subjectRouter);
  app.use('/v1/api', getStripePriceId);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
