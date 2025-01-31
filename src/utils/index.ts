export const truncateText = (text: string, maxLength: number = 100): string => {
  // 텍스트가 지정된 최대 길이 이내면 그대로 반환
  if (text?.length <= maxLength) {
    return text;
  }

  // 텍스트가 최대 길이를 초과하면 잘라내고 '...'을 붙여 반환
  return text?.slice(0, maxLength) + '...';
};

// 날짜 유효성 검사 -> 생성
export const isValidDateForCreation = (
  startDate: string | Date | null,
  endDate: string | Date | null
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜 기준으로 시간 제거

  const start = new Date(startDate ?? today);
  const end = new Date(endDate ?? today);

  return start > today && end > today; // 생성일 조건: startDate와 endDate가 오늘 이후
};

// 날짜 유효성 검사 -> 수정
export const isValidDateForUpdate = (
  endDate: string | Date | null
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜 기준으로 시간 제거

  const end = new Date(endDate ?? today);

  return end > today; // 수정일 조건: endDate가 오늘 이후
};
