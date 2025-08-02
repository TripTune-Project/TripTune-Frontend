/**
 * 이메일 유효성 검사 함수
 *
 * @param email 검사할 이메일 주소
 * @returns 유효한 경우 true, 유효하지 않은 경우 오류 메시지 문자열
 */
export const validateEmail = (email: string): string | true => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return '유효한 이메일 형식이 아닙니다.';
  }
  return true;
};

/**
 * 비밀번호 유효성 검사 함수
 * 비밀번호는 8-15자의 영문자, 숫자, 특수문자 조합이어야 함
 *
 * @param password 검사할 비밀번호
 * @returns 유효한 경우 true, 유효하지 않은 경우 오류 메시지 문자열
 */
export const validatePassword = (password: string): string | true => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

  if (!regex.test(password)) {
    return '비밀번호는 8자 이상 15자 이하의 영문, 숫자, 특수문자 조합이어야 합니다.';
  }
  return true;
};

/**
 * 닉네임 유효성 검사 함수
 * 닉네임은 4-15자의 영문자, 한글, 숫자만 사용 가능
 *
 * @param nickname 검사할 닉네임
 * @returns 유효한 경우 true, 유효하지 않은 경우 오류 메시지 문자열
 */
export const validateNickname = (nickname: string): string | true => {
  const regex = /^[A-Za-z가-힣\d]{4,15}$/;
  if (!regex.test(nickname)) {
    return '닉네임은 4자 이상 15자 이하의 영문 대/소문자, 한글, 숫자만 사용 가능합니다.';
  }
  return true;
};

/**
 * 검색어 유효성 검사 및 처리 함수
 * - 특수문자 제거
 * - 공백 허용
 * - 한글, 영문, 숫자 허용
 * - 입력값 트림 처리
 *
 * @param searchTerm 검사할 검색어
 * @returns {string} 처리된 검색어
 */
export const validateSearchTerm = (searchTerm: string): string => {
  // 앞뒤 공백 제거
  const trimmed = searchTerm.trim();
  // 특수문자를 제외한 문자만 허용 (한글, 영문, 숫자, 공백)
  return trimmed.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
};
