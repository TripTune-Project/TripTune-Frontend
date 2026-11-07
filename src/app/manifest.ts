import type { MetadataRoute } from 'next';

// ponytail: 설치만 지원. 오프라인·푸시가 필요해지면 서비스 워커 추가
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TripTune',
    short_name: 'TripTune',
    description: 'TripTune은 여행자들을 위한 일정 플랫폼 서비스 입니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/assets/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
