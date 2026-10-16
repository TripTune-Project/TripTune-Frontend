import { useTravelStore } from '@/store/scheduleStore';
import {
  addTravelRoute,
  deleteTravelRoute,
  fetchTravelRoute,
  updateTravelRouteOrder,
} from '@/apis/Schedule/locationRouteApi';
import { ApiError } from '@/apis/api';
import { Route } from '@/types/scheduleType';

jest.mock('@/apis/Schedule/locationRouteApi', () => ({
  fetchTravelRoute: jest.fn(),
  addTravelRoute: jest.fn(),
  deleteTravelRoute: jest.fn(),
  updateTravelRouteOrder: jest.fn(),
}));
jest.mock('@/apis/Schedule/scheduleApi', () => ({}));
jest.mock('@/apis/Login/refreshApi', () => ({ refreshApi: jest.fn() }));

const route = (
  routeId: number,
  placeId: number,
  routeOrder: number
): Route => ({
  routeId,
  placeId,
  routeOrder,
  country: '',
  city: '',
  district: '',
  address: '',
  longitude: placeId,
  latitude: placeId,
  placeName: `p${placeId}`,
  thumbnailUrl: null,
});

// 서버 여행 루트: 2페이지, 같은 장소(1)가 두 번 들어 있다 (내 일정 담기)
const mockServerRoutes = (routeVersion: number) =>
  (fetchTravelRoute as jest.Mock).mockImplementation(async (_id, page) => ({
    success: true,
    data: {
      routeVersion,
      totalPages: 2,
      content:
        page === 1 ? [route(10, 1, 1), route(20, 2, 2)] : [route(30, 1, 3)],
    },
  }));

const routeIds = () =>
  useTravelStore.getState().travelRoute.map((r) => r.routeId);

describe('여행 루트 클릭 이벤트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTravelStore.getState().resetTravelRoute();
    mockServerRoutes(3);
  });

  it('전체 페이지를 불러오고 같은 장소도 그대로 두며 routeVersion을 저장한다', async () => {
    await useTravelStore.getState().loadRoutes(1);
    expect(routeIds()).toEqual([10, 20, 30]);
    expect(useTravelStore.getState().routeVersion).toBe(3);
  });

  it('추가는 현재 routeVersion으로 요청하고 서버 루트를 다시 불러온다', async () => {
    await useTravelStore.getState().loadRoutes(1);
    (addTravelRoute as jest.Mock).mockResolvedValue({
      success: true,
      data: { routeVersion: 4 },
    });
    mockServerRoutes(4);

    await useTravelStore.getState().addRoute(1, 99);
    expect(addTravelRoute).toHaveBeenCalledWith(1, 3, 99);
    expect(useTravelStore.getState().routeVersion).toBe(4);
  });

  it('놓는 순간 현재 순서 전체를 orderedRouteIds로 보낸다', async () => {
    await useTravelStore.getState().loadRoutes(1);
    (updateTravelRouteOrder as jest.Mock).mockResolvedValue({
      success: true,
      data: { routeVersion: 4 },
    });

    useTravelStore.getState().onMovePlace(2, 0); // 30을 맨 앞으로
    await useTravelStore.getState().saveRouteOrder(1, 30);
    expect(updateTravelRouteOrder).toHaveBeenCalledWith(1, 30, 3, [30, 10, 20]);
  });

  it('409 버전 충돌이면 메시지를 남기고 최신 루트로 되돌린다', async () => {
    await useTravelStore.getState().loadRoutes(1);
    (deleteTravelRoute as jest.Mock).mockRejectedValue(
      new ApiError('데이터가 변경되었습니다. 최신 정보를 확인해주세요.', 409)
    );
    mockServerRoutes(5);

    await useTravelStore.getState().deleteRoute(1, 20);
    expect(useTravelStore.getState().routeError?.message).toBe(
      '데이터가 변경되었습니다. 최신 정보를 확인해주세요.'
    );
    expect(routeIds()).toEqual([10, 20, 30]);
    expect(useTravelStore.getState().routeVersion).toBe(5);
  });

  it('[-]는 같은 장소의 루트를 모두 삭제한다', async () => {
    await useTravelStore.getState().loadRoutes(1);
    (deleteTravelRoute as jest.Mock).mockResolvedValue({
      success: true,
      data: { routeVersion: 4 },
    });

    await useTravelStore.getState().deletePlaceRoutes(1, 1);
    expect(
      (deleteTravelRoute as jest.Mock).mock.calls.map((call) => call[1])
    ).toEqual([10, 30]);
  });

  it('편집 권한이 없으면 요청하지 않는다', async () => {
    useTravelStore.getState().setCanEdit(false);
    await useTravelStore.getState().addRoute(1, 99);
    expect(addTravelRoute).not.toHaveBeenCalled();
    expect(useTravelStore.getState().editDeniedAt).toBeGreaterThan(0);
  });
});
