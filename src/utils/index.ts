export const truncateText = (text: string, maxLength: number = 100): string => {
  // 텍스트가 지정된 최대 길이 이내면 그대로 반환
  if (text?.length <= maxLength) {
    return text;
  }

  // 텍스트가 최대 길이를 초과하면 잘라내고 '...'을 붙여 반환
  return text?.slice(0, maxLength) + '...';
};
