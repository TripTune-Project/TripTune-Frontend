import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: 'TripTune - Explore and Plan Your Travel',
  description: 'TripTune은 여행자들을 위한 일정 플랫폼 서비스 입니다. Discover top travel destinations and plan your trips with TripTune.',
  keywords: ['travel', 'trip planning', 'explore destinations', 'TripTune', 'travel ideas', 'itinerary', '여행', '일정', '여행지'],
  openGraph: {
    title: 'TripTune - Explore and Plan Your Travel',
    description: 'Discover top travel destinations and plan your trips with TripTune. Start your journey with personalized travel plans and recommendations.',
    url: 'https://www.triptune.site',
    siteName: 'TripTune',
    images: [
      {
        url: '/assets/Logo.png',
        width: 1200,
        height: 630,
        alt: 'TripTune Logo',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};
