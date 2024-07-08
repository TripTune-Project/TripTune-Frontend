"use client";

import React, { useState } from 'react';
import LogoutModal from '../../components/Logout/LogoutModal';
import { logoutApi } from '../../api/logoutApi';
import { Alert, Snackbar } from '@mui/material';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleLogout = async () => {
    closeModal();
    try {
      await logoutApi();
    } catch (error) {
      setAlertMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      setAlertOpen(true);
    }
  };
  
  const handleAlertClose = () => setAlertOpen(false);
  
  return (
    <div>
      메인 페이지 - 홈
      <button onClick={openModal}>로그아웃</button>
      <LogoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
      />
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
