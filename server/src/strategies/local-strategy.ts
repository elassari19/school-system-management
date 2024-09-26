import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '@prisma/client';
import { redisCacheHandler } from '../utils/redisCache';
import { prisma } from '../utils/configs';
import { compare } from 'bcryptjs';

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done: any) => {
      try {
        const user = (await redisCacheHandler(
          email,
          async () =>
            await prisma.user.findUnique({
              where: { email },
            })
        )) as User;
        if (!user || !(await compare(password, user.password))) {
          return done(null, false);
        }
        const { password: _, ...rest } = user;
        return done(null, rest);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: Partial<User>, done) => {
  done(null, user);
});

export default passport.deserializeUser(async (user: User, done) => {
  if (!user) {
    return done(null, false);
  }
  const { password: _, ...rest } = user;
  // const user = await prisma.user.findUnique({ where: { email } });
  done(null, rest);
});
