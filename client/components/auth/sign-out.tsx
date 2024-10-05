'use client';

import React from 'react';
import { Button } from '../ui/button';
import { signOut } from '../../app/api/auth';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const SignOut = () => {
  const t = useTranslations();
  const _signOut = async () => {
    const response = await signOut();
    if (response.ok) {
      return toast.success(t('Signed out successfully'));
    }
    return toast.error(t('Failed to sign out'));
  };
  return (
    <Button variant="link" onClick={_signOut} className="font-bold w-full">
      {t('SignOut')}
    </Button>
  );
};

export default SignOut;
