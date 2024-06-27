import Cookies from 'js-cookie';

const useToken = () => {
  const logoutDeleteToken = () => {
    Cookies.remove('trip-tune_at');
    Cookies.remove('trip-tune_rt');
    window.location.href = '/login';
  };
  
  return {
    logoutDeleteToken,
  };
};

export default useToken;
