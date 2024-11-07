'use client';

import React from 'react';
import { Button } from '../ui/button';
import { signOut } from '@/app/api/auth';
import toast from 'react-hot-toast';
import useIntlTranslations from '@/hooks/use-intl-translations';

const SignOut = () => {
  const { au, g } = useIntlTranslations();
  const _signOut = async () => {
    const response = await signOut();
    if (response.ok) {
      return toast.success(au('Signed out successfully'));
    }
    return toast.error(au('Failed to sign out'));
  };
  return (
    <Button variant="link" onClick={_signOut} className="font-bold w-full">
      {g('SignOut')}
    </Button>
  );
};

export default SignOut;
