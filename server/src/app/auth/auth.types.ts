import { User } from '@prisma/client';
import { Request } from 'express';
import { Session, SessionData } from 'express-session';

export interface ExtendsSessionRequest extends Request {
  session: Session &
    Partial<SessionData> & {
      isAuthenticated?: boolean;
      user: Partial<User>;
    };
}
