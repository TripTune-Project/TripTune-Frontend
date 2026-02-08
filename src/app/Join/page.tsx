'use client';

import { useEffect } from 'react';
import JoinForm from '@/components/Feature/Join/JoinForm';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function JoinPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <>
      <JoinForm />
    </>
  );
}
