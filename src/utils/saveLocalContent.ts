import Cookies from 'js-cookie';

const saveLocalContent = () => {
  const setEncryptedCookie = (name: string, value: string) => {
    Cookies.set(name, value, {
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
