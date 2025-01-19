'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutModal from '@/components/Common/LogoutModal';
import styles from '@/styles/Mypage.module.css';
import Profile from '@/components/Feature/MyPage/Profile';
import Account from '@/components/Feature/MyPage/Account';
import BookMark from '@/components/Feature/MyPage/BookMark';
import { logoutApi } from '@/apis/Login/logoutApi';

const MyPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleLogout = async () => {
    closeModal();
    await performLogout();
  };
  
  const performLogout = async () => {
    try {
      await logoutApi();
      router.push('/');
    } catch (error) {
      console.error('로그아웃에 실패했습니다. 다시 시도해 주세요.');
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          프로필 관리
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'account' ? styles.active : ''}`}
          onClick={() => setActiveTab('account')}
        >
          계정 관리
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'bookmark' ? styles.active : ''}`}
          onClick={() => setActiveTab('bookmark')}
        >
          북마크
        </div>
        <div
          className={styles.tab}
          onClick={() => setIsModalOpen(true)}
        >
          <div onClick={openModal}>로그아웃</div>
          <LogoutModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleLogout}
          />
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === 'profile' && (
          <Profile />
        )}
        {activeTab === 'account' && (
          <Account />
        )}
        {activeTab === 'bookmark' &&
          <BookMark />
        }
      </div>
    </div>
  );
};

export default MyPage;
