import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import sessionMiddelware from '../middelwares/session.middelware';
import swaggerDocs from '../utils/swagger';
import api from '../../api';

/* ROUTE IMPORTS */
import authRouter from './auth/auth.route';
import userRouter from './user/user.route';
import studentRouter from './student/student.route';
import subjectRouter from './subject/subject.route';
import courseRouter from './course/course.route';
import chapterRouter from './chapter/chapter.route';
import contentRouter from './content/content.route';
import classRouter from './class/class.route';
import groupRouter from './group/group.route';
import { getStripePriceId } from './payment/payment.route';
import { errorHandler, notFound } from '../middelwares';

export const createApp = () => {
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
  swaggerDocs(app, Number(process.env.PORT) || 3001);
  app.use('/v1/api/auth', authRouter);
  app.use('/v1/api/user', userRouter);
  app.use('/v1/api/student', studentRouter);
  app.use('/v1/api/subject', subjectRouter);
  app.use('/v1/api/course', courseRouter);
  app.use('/v1/api/chapter', chapterRouter);
  app.use('/v1/api/content', contentRouter);
  app.use('/v1/api/class', classRouter);
  app.use('/v1/api/group', groupRouter);
  app.use('/v1/api', getStripePriceId);

  app.use(notFound);
  app.use(errorHandler);

  app.use('/v1/api', api);

  return app;
};
