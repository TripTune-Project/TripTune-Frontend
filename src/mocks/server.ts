import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

interface TravelBody {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
}

// API 핸들러 정의
const handlers = [
  // 여행 목록 조회
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/travels`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: '제주도 여행',
        location: '제주시',
        startDate: '2024-03-01',
        endDate: '2024-03-03',
        status: 'PLANNED'
      }
    ], { status: 200 });
  }),

  // 여행 생성
  http.post(`${process.env.NEXT_PUBLIC_API_URL}/travels`, async ({ request }) => {
    const body = await request.json() as TravelBody;
    return HttpResponse.json({
      id: 2,
      ...body
    }, { status: 201 });
  }),

  // 여행 수정
  http.put(`${process.env.NEXT_PUBLIC_API_URL}/travels/:id`, async ({ params, request }) => {
    const body = await request.json() as TravelBody;
    return HttpResponse.json({
      id: params.id,
      ...body
    }, { status: 200 });
  }),

  // 여행 삭제
  http.delete(`${process.env.NEXT_PUBLIC_API_URL}/travels/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // 에러 핸들러
  http.all('*', ({ request }) => {
    console.error(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  })
];

// MSW 서버 설정
export const server = setupServer(...handlers); 