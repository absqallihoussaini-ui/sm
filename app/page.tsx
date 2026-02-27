'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session) {
      router.push('/students');
    } else {
      router.push('/login');
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center text-gray-600">Redirecting...</p>
    </div>
  );
}
