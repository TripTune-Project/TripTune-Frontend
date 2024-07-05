"use client";

import React, { useState } from 'react';
import LogoutModal from '../../components/Logout/LogoutModal';
import { logout } from '../../api/logout';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleLogout = async () => {
    closeModal();
    await logout();
  };
  
  return (
    <div>
      메인 페이지 - 홈
      <button onClick={openModal}>로그아웃</button>
      <LogoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Home;
