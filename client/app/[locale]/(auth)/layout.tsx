import AuthLayoutContent from '@/components/auth/auth-layout-content';

export const metadata = {
  title: 'Sign In | School Anoul',
  description: 'Sign in to your School Anoul account',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutContent>{children}</AuthLayoutContent>;
}