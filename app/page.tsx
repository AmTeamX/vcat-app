'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by trying to access a protected endpoint
    fetch('/api/patients')
      .then((res) => {
        if (res.ok) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl text-gray-600">กำลังโหลด...</div>
    </div>
  );
}
