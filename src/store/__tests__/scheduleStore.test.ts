import { useTravelStore } from '@/store/scheduleStore';
import { fetchTravelRoute } from '@/apis/Schedule/locationRouteApi';
import { Place } from '@/types/scheduleType';

jest.mock('@/apis/Schedule/locationRouteApi', () => ({
  fetchTravelRoute: jest.fn(),
}));
jest.mock('@/apis/Schedule/scheduleApi', () => ({}));

const place = (placeId: number, routeOrder?: number): Place => ({
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

// 서버에는 1 → 2 → 3 순서로 저장되어 있다
(fetchTravelRoute as jest.Mock).mockResolvedValue({
  success: true,
  data: {
    totalPages: 1,
    content: [place(1, 1), place(2, 2), place(3, 3)],
  },
});

const ids = () => useTravelStore.getState().travelRoute.map((p) => p.placeId);

describe('fetchAndMergeRoutes (탭 전환 시 재호출)', () => {
  beforeEach(() => useTravelStore.getState().resetTravelRoute());

  it('최초 로드는 서버 순서를 따른다', async () => {
    await useTravelStore.getState().fetchAndMergeRoutes(1);
    expect(ids()).toEqual([1, 2, 3]);
  });

  it('저장 전 드래그·추가·삭제가 재호출 후에도 유지된다', async () => {
    const store = useTravelStore.getState();
    await store.fetchAndMergeRoutes(1);

    store.onMovePlace(2, 0); // 3을 맨 앞으로 → [3, 1, 2]
    store.addPlaceToRoute(place(4)); // routeOrder 없는 신규 장소 → 맨 뒤
    store.removePlace(1); // [3, 2, 4]

    await useTravelStore.getState().fetchAndMergeRoutes(1);
    expect(ids()).toEqual([3, 2, 4]);
  });

  it('같은 장소가 두 번 있으면 둘 다 보이고, 드래그 삭제는 하나만 지운다', async () => {
    (fetchTravelRoute as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: {
        totalPages: 1,
        content: [place(1, 1), place(2, 2), place(1, 3)],
      },
    });
    await useTravelStore.getState().fetchAndMergeRoutes(1);
    expect(ids()).toEqual([1, 2, 1]);

    useTravelStore.getState().removeRouteAt(2);
    expect(ids()).toEqual([1, 2]);
    // 남은 1번 장소의 마커는 유지
    expect(
      useTravelStore.getState().addedPlaces.map((p) => p.placeId)
    ).toContain(1);
  });

  it('reloadRoutes는 로컬 편집을 버리고 서버 순서로 교체한다 (다른 참석자 저장 이벤트)', async () => {
    const store = useTravelStore.getState();
    await store.fetchAndMergeRoutes(1);

    store.onMovePlace(2, 0);
    store.removePlace(1);

    await useTravelStore.getState().reloadRoutes(1);
    expect(ids()).toEqual([1, 2, 3]);
  });
});
