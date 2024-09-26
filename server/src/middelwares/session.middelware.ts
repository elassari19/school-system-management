import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const store = new PrismaSessionStore(
  prisma as unknown as PrismaSessionStore['prisma'],
  {
    checkPeriod: 5 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }
);

export default session({
  // @ts-ignore
  // store,
  secret: process.env.SECRET_KEY || 'j809898nbbbhf76v65c4cuj',
  saveUninitialized: false,
  resave: false,
  name: 'sessionId',
  cookie: {
    secure: false, // if true: only transmit cookie over https, in prod, always activate this
    httpOnly: true, // if true: prevents client side JS from reading the cookie
    maxAge: 86400 * 30, // session max age in milliseconds
    // explicitly set cookie to lax
    // to make sure that all cookies accept it
    // you should never use none anyway
    sameSite: 'lax',
  },
});
