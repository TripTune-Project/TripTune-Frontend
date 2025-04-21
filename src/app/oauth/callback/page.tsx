'use client';

import { Suspense } from 'react';
import OAuthCallbackClient from './OAuthCallbackClient';
import VerificationLoading from '@/components/Common/VerificationLoading';

export default function OAuthCallback() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <OAuthCallbackClient />
    </Suspense>
  );
}
