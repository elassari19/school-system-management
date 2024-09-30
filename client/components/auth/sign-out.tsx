'use client';

import React from 'react';
import { Button } from '../ui/button';
import { signOut } from '../../app/api/auth';
import toast from 'react-hot-toast';

const SignOut = () => {
  const _signOut = async () => {
    const response = await signOut();
    if (response.ok) {
      return toast.success('Signed out successfully');
    }
    return toast.error('Failed to sign out');
  };
  return (
    <Button variant="link" onClick={_signOut} className="font-bold w-full">
      SignOut
    </Button>
  );
};

export default SignOut;
