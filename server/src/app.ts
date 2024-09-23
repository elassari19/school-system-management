import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

/* ROUTE IMPORTS */
import { getUser, getUsers } from './routes/user.route';

export const creatApp = () => {
  /* CONFIGURATIONS */
  dotenv.config();
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.use(morgan('common'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());

  /* ROUTES */
  app.use('/v1/api', getUser);
  app.use('/v1/api', getUsers);

  return app;
};
