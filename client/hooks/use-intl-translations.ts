import { useTranslations } from 'next-intl';

const useIntlTranslations = () => {
  const t = useTranslations('');
  const g = useTranslations('global');
  const a = useTranslations('academic');
  const au = useTranslations('auth');

  return {
    t,
    g,
    a,
    au,
  };
};

export default useIntlTranslations;
