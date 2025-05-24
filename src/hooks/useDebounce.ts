import { useEffect, useState } from 'react';

/**
 * useDebounce 훅 - 입력값에 대한 디바운싱 처리
 *
 * 주요 기능:
 * - 입력값이 지정된 시간(delay) 동안 변경되지 않을 때만 값을 업데이트
 * - 연속적인 이벤트(타이핑, 검색 등)에서 성능 최적화에 유용
 * - API 호출, 검색 기능 등에 활용
 *
 * @param value 디바운싱할 원본 값
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운싱된 값
 */
export const useDebounce = (value: string, delay: number) => {
  // 디바운싱된 값을 저장할 상태
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 지정된 지연 시간 후에 값을 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 컴포넌트 언마운트 또는 value/delay 변경 시 타이머 정리
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
