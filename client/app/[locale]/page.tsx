import { getTranslations } from 'next-intl/server';

interface IProps {}

export default async function Home({}: IProps) {
  const t = await getTranslations('');
  return <div></div>;
}
