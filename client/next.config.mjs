import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      // ... other existing domains
    ],
  },
};
export default withNextIntl(nextConfig);
