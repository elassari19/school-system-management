'use client';

import Link from 'next/link';
import SignUp from '@/components/auth/sign-up';

export default function page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-1/2 xl:w-1/3 px-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-mono mb-4">Sign Up</h1>
        <SignUp />
        <div className="flex gap-2 items-center mt-2">
          <p>Already have an account?</p>
          <Link href={'sign-in'} className="text-sm font-bold">
            SignIn
          </Link>
        </div>
      </div>
    </div>
  );
}
