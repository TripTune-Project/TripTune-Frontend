import { ApiError, patch } from '@/apis/api';

jest.mock('@/apis/Login/refreshApi', () => ({ refreshApi: jest.fn() }));

describe('fetchData 오류 응답', () => {
  it('409 응답은 상태 코드가 담긴 ApiError로 던진다 (일정 저장 version 충돌)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        success: false,
        errorCode: 409,
        message: '데이터가 변경되었습니다. 최신 정보를 확인해주세요.',
      }),
    });

    const error = (await patch('/api/schedules/1', {}).catch(
      (e) => e
    )) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(409);
    expect(error.message).toBe(
      '데이터가 변경되었습니다. 최신 정보를 확인해주세요.'
    );
  });
});
