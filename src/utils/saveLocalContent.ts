import Cookies from 'js-cookie';

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
    Cookies.set(name, encodeURIComponent(value), {
      secure: true,
      sameSite: 'strict',
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
