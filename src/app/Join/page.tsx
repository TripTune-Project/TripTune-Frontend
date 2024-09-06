'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import JoinForm from '../../components/Join/JoinForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const router = useRouter();
  
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = Cookies.get('trip-tune_at');
      const refreshToken = Cookies.get('trip-tune_rt');
      
      if (accessToken && refreshToken) {
        router.push('/');
      }
    };
    
    checkAuthStatus();
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Join TripTune | Create Your Account</title>
        <meta name="description"
              content="Sign up for TripTune to start planning your trips and exploring new destinations. Join now to create your personalized travel experience." />
        <meta name="keywords" content="join, sign up, TripTune, travel planning, create account" />
        <meta property="og:title" content="Join TripTune | Create Your Account" />
        <meta property="og:description"
              content="Sign up for TripTune to start planning your trips and exploring new destinations. Join now to create your personalized travel experience." />
        <meta property="og:image" content="/assets/Logo.png" />
        <meta property="og:url" content="https://triptune.netlify.app/Join" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <JoinForm />
    </>
  );
}
