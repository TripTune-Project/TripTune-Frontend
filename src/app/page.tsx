import type { Metadata } from 'next';
import HomePageClient from '@/components/Feature/Home/HomePageClient';

export const metadata: Metadata = {
  title: 'TripTune - Explore and Plan Your Travel',
  description:
    'Discover top travel destinations and plan your trips with TripTune. Start your journey with personalized travel plans and recommendations.',
  keywords: 'travel, trip planning, explore destinations, TripTune, travel ideas, itinerary',
  openGraph: {
    title: 'TripTune - Explore and Plan Your Travel',
    description:
      'Discover top travel destinations and plan your trips with TripTune. Start your journey with personalized travel plans and recommendations.',
    images: [{ url: '/assets/Logo.png' }],
    url: 'https://www.triptune.co.kr',
  },
};

async function fetchInitialPopularTravel() {
  try {
    const res = await fetch(
      'https://www.triptune.co.kr/api/travels/popular?city=all',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

async function fetchInitialRecommendTravel() {
  try {
    const res = await fetch(
      'https://www.triptune.co.kr/api/travels/recommend?theme=all',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [popularInitialData, recommendInitialData] = await Promise.all([
    fetchInitialPopularTravel(),
    fetchInitialRecommendTravel(),
  ]);

  return (
    <HomePageClient
      popularInitialData={popularInitialData}
      recommendInitialData={recommendInitialData}
    />
  );
}
