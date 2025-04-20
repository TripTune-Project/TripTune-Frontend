export const validateEmail = (email: string): string | true => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return '유효한 이메일 형식이 아닙니다.';
  }
  return true;
};

export const validatePassword = (password: string): string | true => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

  if (!regex.test(password)) {
    return '비밀번호는 8자 이상 15자 이하의 영문, 숫자, 특수문자 조합이어야 합니다.';
  }
  return true;
};

export const validateNickname = (nickname: string): string | true => {
  const regex = /^[A-Za-z가-힣\d]{4,15}$/;
  if (!regex.test(nickname)) {
    return '닉네임은 4자 이상 15자 이하의 영문 대/소문자, 한글, 숫자만 사용 가능합니다.';
  }
  return true;
};
