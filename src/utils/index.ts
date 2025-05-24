/**
 * 텍스트를 지정된 최대 길이로 제한하는 함수
 * 최대 길이를 초과하는 경우 '...'을 추가하여 반환
 *
 * @param text 제한할 텍스트
 * @param maxLength 최대 길이 (기본값: 100)
 * @returns 제한된 텍스트
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  // 텍스트가 지정된 최대 길이 이내면 그대로 반환
  if (text?.length <= maxLength) {
    return text;
  }

  // 텍스트가 최대 길이를 초과하면 잘라내고 '...'을 붙여 반환
  return text?.slice(0, maxLength) + '...';
};
