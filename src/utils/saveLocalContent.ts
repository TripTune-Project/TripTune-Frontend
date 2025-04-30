import Cookies from 'js-cookie';

const saveLocalContent = () => {
  const setEncryptedCookie = (name: string, value: string) => {
    Cookies.set(name, encodeURIComponent(value), {
      secure: true,
      sameSite: 'strict',
    });
  };
  
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
