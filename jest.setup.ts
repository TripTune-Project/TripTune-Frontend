import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// MSW 서버 시작
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 전역 모의 함수 설정
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// 테스트 환경 변수 설정
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5814/api';
process.env.NEXT_PUBLIC_TEST_API_KEY = 'test-api-key-123';

// 테스트 타임아웃 설정
jest.setTimeout(10000); 