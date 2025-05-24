import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Travel from '../Travel';
import { TravelProvider } from '../TravelContext';

// 모의 데이터
const mockTravelData = [
  {
    id: 1,
    title: '제주도 여행',
    location: '제주시',
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    status: 'PLANNED'
  },
  {
    id: 2,
    title: '부산 여행',
    location: '부산시',
    startDate: '2024-04-01',
    endDate: '2024-04-03',
    status: 'COMPLETED'
  }
];

// 모의 API 응답
jest.mock('@/api/travel', () => ({
  getTravels: jest.fn().mockResolvedValue(mockTravelData),
  createTravel: jest.fn().mockResolvedValue({ id: 3, ...mockTravelData[0] }),
  updateTravel: jest.fn().mockResolvedValue({ ...mockTravelData[0], title: '수정된 제주도 여행' }),
  deleteTravel: jest.fn().mockResolvedValue({ success: true })
}));

describe('Travel 컴포넌트 통합 테스트', () => {
  const renderTravel = () => {
    return render(
      <TravelProvider>
        <Travel />
      </TravelProvider>
    );
  };

  it('여행 목록이 정상적으로 로드된다', async () => {
    renderTravel();
    
    // 로딩 상태 확인
    expect(screen.getByText('목록 로딩 중...')).toBeInTheDocument();
    
    // 데이터 로드 후 확인
    await waitFor(() => {
      expect(screen.getByText('제주도 여행')).toBeInTheDocument();
      expect(screen.getByText('부산 여행')).toBeInTheDocument();
    });
  });

  it('여행 필터링이 정상적으로 동작한다', async () => {
    renderTravel();
    
    // 데이터 로드 대기
    await waitFor(() => {
      expect(screen.getByText('제주도 여행')).toBeInTheDocument();
    });

    // 필터 입력
    const filterInput = screen.getByPlaceholderText('여행 검색...');
    await userEvent.type(filterInput, '제주');

    // 필터링 결과 확인
    expect(screen.getByText('제주도 여행')).toBeInTheDocument();
    expect(screen.queryByText('부산 여행')).not.toBeInTheDocument();
  });

  it('여행 상태 변경이 정상적으로 동작한다', async () => {
    renderTravel();
    
    // 데이터 로드 대기
    await waitFor(() => {
      expect(screen.getByText('제주도 여행')).toBeInTheDocument();
    });

    // 상태 변경 버튼 클릭
    const statusButton = screen.getByRole('button', { name: /상태 변경/i });
    await userEvent.click(statusButton);

    // 변경된 상태 확인
    await waitFor(() => {
      expect(screen.getByText('진행 중')).toBeInTheDocument();
    });
  });

  it('여행 삭제가 정상적으로 동작한다', async () => {
    renderTravel();
    
    // 데이터 로드 대기
    await waitFor(() => {
      expect(screen.getByText('제주도 여행')).toBeInTheDocument();
    });

    // 삭제 버튼 클릭
    const deleteButton = screen.getByRole('button', { name: /삭제/i });
    await userEvent.click(deleteButton);

    // 확인 모달에서 확인 버튼 클릭
    const confirmButton = screen.getByRole('button', { name: /확인/i });
    await userEvent.click(confirmButton);

    // 삭제 후 목록에서 제거 확인
    await waitFor(() => {
      expect(screen.queryByText('제주도 여행')).not.toBeInTheDocument();
    });
  });

  it('에러 발생 시 에러 UI가 표시된다', async () => {
    // API 에러 모의
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    renderTravel();

    // 에러 UI 확인
    await waitFor(() => {
      expect(screen.getByText('오류가 발생했습니다.')).toBeInTheDocument();
    });
  });
}); 