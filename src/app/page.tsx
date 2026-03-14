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
    url: 'https://www.triptune.site',
  },
};

export default function Home() {
  return <HomePageClient />;
}
