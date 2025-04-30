import { setupServer } from 'msw/node';
import { rest } from 'msw';

// API 핸들러 정의
const handlers = [
  // 여행 목록 조회
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/travels`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: '제주도 여행',
          location: '제주시',
          startDate: '2024-03-01',
          endDate: '2024-03-03',
          status: 'PLANNED'
        }
      ])
    );
  }),

  // 여행 생성
  rest.post(`${process.env.NEXT_PUBLIC_API_URL}/travels`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        ...req.body
      })
    );
  }),

  // 여행 수정
  rest.put(`${process.env.NEXT_PUBLIC_API_URL}/travels/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        ...req.body
      })
    );
  }),

  // 여행 삭제
  rest.delete(`${process.env.NEXT_PUBLIC_API_URL}/travels/:id`, (req, res, ctx) => {
    return res(
      ctx.status(204)
    );
  }),

  // 에러 핸들러
  rest.all('*', (req, res, ctx) => {
    console.error(`Unhandled ${req.method} request to ${req.url}`);
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal Server Error' })
    );
  })
];

// MSW 서버 설정
export const server = setupServer(...handlers); 