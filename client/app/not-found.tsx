import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p>Could not find the requested resource</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}