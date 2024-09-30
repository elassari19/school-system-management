import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default createMiddleware(routing);

// export default async (req: NextRequest) => {
//   // protect the route
//   const protectedRoutes = ['/dashboard', '/dashboard/*'];
//   const currentPath = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(currentPath);

//   if (isProtectedRoute) {
//     console.log('req.cookies', req.cookies);
//     // Check if the user is authenticated
//     const sessoin = cookies().get('session')?.value;
//     if (!sessoin) {
//       return NextResponse.redirect(
//         new URL('/login', req.nextUrl.origin).toString()
//       );
//     }
//   }
//   return NextResponse.next();
// };

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*'],
};
