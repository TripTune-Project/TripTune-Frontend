import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useMyScheduleList } from '@/hooks/useSchedule';
import { addPlaceToSchedule } from '@/apis/Schedule/scheduleApi';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import emtpyScheduleIcon from '../../../../public/assets/images/여행지 탐색/상세화면/emtpyScheduleIcon.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface MyScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: number;
}

const MyScheduleEditModal = ({
  isOpen,
  onClose,
  placeId,
}: MyScheduleEditModalProps) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  const {
    data: schedulePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyScheduleList(isOpen);

  // Snackbar 상태
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'info' | 'success' | 'error' | 'warning'
  >('info');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    } else {
      document.body.style.overflow = 'auto'; // 스크롤 복원
    }
    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시 복원
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const schedules =
    schedulePages?.pages.flatMap((page) => page.data?.content) || [];

  const handleAddPlace = async () => {
    if (!selectedScheduleId) {
      setAlertMessage('일정을 선택해주세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    try {
      const response = await addPlaceToSchedule(selectedScheduleId, placeId);
      if (response.success) {
        setAlertMessage('장소가 성공적으로 추가되었습니다.');
        setAlertSeverity('success');
        setAlertOpen(true);
      } else {
        setAlertMessage(response.message as string);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage('일정을 추가하는 중 오류가 발생했습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCheckboxChange = (scheduleId: number) => {
    // 동일한 ID가 클릭되면 선택 해제
    if (selectedScheduleId === scheduleId) {
      setSelectedScheduleId(null);
    } else {
      // 다른 ID를 선택
      setSelectedScheduleId(scheduleId);
    }
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <Header>
          <Image src={triptuneIcon} alt='파비콘' width={24} height={24} />
          <ModalTitle>내 일정 담기</ModalTitle>
        </Header>
        <Divider />
        <ModalSubtitle>여행지를 추가하고 싶은 일정을 선택하세요.</ModalSubtitle>
        <Notice>
          ※ 편집 권한이 있는 일정만 보여지며 일정을 선택하면 여행 루트의 마지막
          여행지에 추가됩니다.
        </Notice>
        <ScrollableContainer
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (
              scrollHeight - scrollTop === clientHeight &&
              hasNextPage &&
              !isFetchingNextPage
            ) {
              fetchNextPage();
            }
          }}
        >
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <ScheduleItemContainer
                key={schedule?.scheduleId}
                isSelected={selectedScheduleId === schedule?.scheduleId}
              >
                <ScheduleItem>
                  <div style={{marginTop: "-10px"}}>
                    <ScheduleName>{schedule?.scheduleName}</ScheduleName>
                    <ScheduleDate>
                      일정: {schedule?.startDate} ~ {schedule?.endDate}
                    </ScheduleDate>
                    <ScheduleAuthor>작성자: {schedule?.author}</ScheduleAuthor>
                  </div>
                  <StyledCheckbox
                    type="checkbox"
                    onChange={() => handleCheckboxChange(schedule?.scheduleId)}
                    checked={selectedScheduleId === schedule?.scheduleId}
                  />
                </ScheduleItem>
              </ScheduleItemContainer>
            ))
          ) : (
            <EmptyMessage>
              <EmptyMessageIcon>
                <Image
                  src={emtpyScheduleIcon}
                  alt={'no-schedule-root'}
                  width={80}
                  height={80}
                />
              </EmptyMessageIcon>
              <EmptyMessageText>일정이 존재하지 않습니다.</EmptyMessageText>
              <EmptyMessageText>
                작성한 일정이 없거나, 일정들에 대한 편집 권한이 없어 표시되지
                않습니다.
              </EmptyMessageText>
            </EmptyMessage>
          )}
          {isFetchingNextPage && <LoadingMessage>로딩 중...</LoadingMessage>}
        </ScrollableContainer>
        {schedules.length > 0 && (
          <SelectButton disabled={!selectedScheduleId} onClick={handleAddPlace}>
            선택하기
          </SelectButton>
        )}
      </ModalContainer>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </ModalOverlay>
  );
};

export default MyScheduleEditModal;

// 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: -500px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 30px 0px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.3);
  padding: 37px;
  position: relative;
  width: 503px;
  height: 557px;
  flex-shrink: 0;
  margin: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ModalTitle = styled.h1`
  font-style: normal;
  line-height: 130%; /* 26px */
  color: #000;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 400;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
`;

const ModalSubtitle = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 505;
  line-height: 145%; /* 20.3px */
  
`;

const Notice = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  margin-top: 8px;
  color: #F86C6C;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 15px */
  margin-bottom:20px;
`;

const ScrollableContainer = styled.div`
  max-height: 293px;
  overflow-y: auto;
  padding-right: 8px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const ScheduleItemContainer = styled.div`
  padding: 8px 22px;
  width: 413px;
  height: 91px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 2px solid #ddd;
  margin-bottom:8px;
  background: rgba(237, 249, 247, 0.30);
  
  ${({ isSelected }: { isSelected?: boolean }) =>
    isSelected &&
    `
    border: 2px solid #76ADAC;
  `}
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ScheduleName = styled.h3`
  color: #000;
  font-family: NOto Sans KR, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 505;
  line-height: 150%; /* 18px */
`;

const ScheduleDate = styled.p`
  color: #333;
  font-family: NOto Sans KR, sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 15px */
`;

const ScheduleAuthor = styled.p`
  color: #333;
  font-family: NOto Sans KR, sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 15px */
`;

const StyledCheckbox = styled.input`
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-radius: 50%;
  appearance: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;

  &:checked {
    background-color: #76adac;
    border: none;
    position: relative;
  }

  &:checked::after {
    content: '✓';
    color: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -10%;
    left: 30%;
  }
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: #999;
`;

const EmptyMessageText = styled.p`
  font-size: 14px;
  margin-top: 10px;
  color: #666;
`;

const EmptyMessageIcon = styled.div`
  font-size: 36px;
  color: #76adac;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const SelectButton = styled.button`
  background: ${({ disabled }) => (disabled ? '#ccc' : '#76adac')};
  color: ${({ disabled }) => (disabled ? '#888' : '#ffffff')};
  border: none;
  padding: 10px 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  display: flex;
  width: 429px;
  height: 45px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  background: #76ADAC;
  text-align: center;
  font-family: NOto Sans KR, sans-serif;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 22.4px */
`;
