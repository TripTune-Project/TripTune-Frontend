import Cookies from 'js-cookie';

/**
 * 운영에서는 triptune.co.kr / www.triptune.co.kr 어느 쪽에서든 같은 로그인 쿠키를 보도록
 * 상위 도메인으로 저장한다. (localhost 등 그 외 환경은 현재 호스트에만 저장)
 */
const getCookieDomain = () =>
  typeof window !== 'undefined' &&
  window.location.hostname.endsWith('triptune.co.kr')
    ? '.triptune.co.kr'
    : undefined;

/**
 * 쿠키 삭제: 상위 도메인 쿠키와 예전 방식(호스트 전용) 쿠키를 모두 지운다
 */
export const removeCookie = (name: string) => {
  Cookies.remove(name);
  const domain = getCookieDomain();
  if (domain) Cookies.remove(name, { domain });
};

/** 로그인 쿠키(accessToken, nickname) 삭제 */
export const removeAuthCookies = () => {
  removeCookie('accessToken');
  removeCookie('nickname');
};

/**
 * 암호화된 쿠키 관리를 위한 유틸리티 함수
 *
 * @returns 쿠키 설정 및 가져오기 관련 함수들을 포함한 객체
 */
const saveLocalContent = () => {
  /**
   * 인코딩된 쿠키를 설정하는 함수
   * secure와 sameSite 옵션을 적용하여 보안성 강화
   *
   * @param name 쿠키 이름
   * @param value 저장할 값
   */
  const setEncryptedCookie = (name: string, value: string) => {
    // - accessToken : 1시간
    // - refreshToken, nickname : 1주일
    // 같은 이름의 호스트 전용 쿠키가 남아 있으면 새 값을 가리므로 먼저 지운다
    if (getCookieDomain()) Cookies.remove(name);
    Cookies.set(name, encodeURIComponent(value), {
      secure: true,
      sameSite: 'strict',
      expires: name === 'accessToken' ? 1 / 24 : 7, // 1시간 또는 7일
      domain: getCookieDomain(),
    });
  };

  /**
   * 인코딩된 쿠키 값을 가져와 디코딩하는 함수
   *
   * @param name 가져올 쿠키 이름
   * @returns 디코딩된 쿠키 값 또는 undefined(쿠키가 없는 경우)
   */
  const getDecryptedCookie = (name: string) => {
    const value = Cookies.get(name);
    return value ? decodeURIComponent(value) : undefined;
  };

  return {
    setEncryptedCookie,
    getDecryptedCookie,
  };
};

export default saveLocalContent;
