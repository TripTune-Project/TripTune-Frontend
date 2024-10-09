import { authGet, authPost } from './authFetch';

// TODO : 일정명 작성 엔드포인트를 호출하는 함수
const createSchedule = async () => {
  const url = '/api/schedules';
  const body = {
    scheduleName: '일정1',
    startDate: '2024-05-02',
    endDate: '2024-05-03',
  };
  
  try {
    const response = await authPost(url, body);
    console.log('일정 작성 성공:', response);
  } catch (error) {
    console.error('일정 작성 실패:', error.message);
  }
};

// TODO : 일정 조회 엔드포인트를 호출하는 함수
const getSchedule = async (scheduleId, page = 1) => {
  const url = `/api/schedules/${scheduleId}?page=${page}`;
  
  try {
    const response = await authGet(url);
    console.log('일정 조회 성공:', response);
  } catch (error) {
    console.error('일정 조회 실패:', error.message);
  }
};
