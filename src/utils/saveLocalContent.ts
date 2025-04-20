import Cookies from 'js-cookie';

const saveLocalContent = () => {
  const setEncryptedCookie = (name: string, value: string, days: number) => {
    Cookies.set(name, value, {
      expires: days,
      secure: true,
      sameSite: 'strict',
    });
  };

  const getDecryptedCookie = (name: string) => {
    return Cookies.get(name);
  };

  return {
    setEncryptedCookie,
    getDecryptedCookie,
  };
};

export default saveLocalContent;
