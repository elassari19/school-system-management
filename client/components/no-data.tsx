'use client';
import React from 'react';
import useIntlTranslations from '../hooks/use-intl-translations';

function NoData() {
  const { g } = useIntlTranslations();
  return (
    <div className="gradient text-xl w-full h-36 flex justify-center items-center">
      <p className="font-bold">{g('No Data')}</p>
    </div>
  );
}

export default NoData;
