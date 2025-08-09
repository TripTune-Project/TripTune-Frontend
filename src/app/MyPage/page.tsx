'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import LogoutModal from '@/components/Common/LogoutModal';
import styles from '@/styles/Mypage.module.css';
import Profile from '@/components/Feature/MyPage/Profile';
import Account from '@/components/Feature/MyPage/Account';
import BookMark from '@/components/Feature/MyPage/BookMark';
import LoginModal from '@/components/Common/LoginModal';
import useAuth from '@/hooks/useAuth';
import DataLoading from '@/components/Common/DataLoading';
import { logoutApi } from '@/apis/Login/logoutApi';
import { useMyPage } from '@/hooks/useMyPage';

const MyPage = () => {
  const router = useRouter();
  const { fetchUserData } = useMyPage();
  const { isAuthenticated, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    closeModal();
    router.push('/');
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

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (isLoading) {
    return <DataLoading />;
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  const getMetaTags = () => {
    switch (activeTab) {
      case 'profile':
        return {
          title: '프로필 관리 - MyPage',
          description: '사용자 프로필 정보를 관리하세요.',
        };
      case 'account':
        return {
          title: '계정 관리 - MyPage',
          description: '계정 설정 및 정보를 확인하세요.',
        };
      case 'bookmark':
        return {
          title: '북마크 조회 - MyPage',
          description: '저장한 북마크를 확인하세요.',
        };
      default:
        return {
          title: 'MyPage',
          description: 'MyPage를 관리하세요.',
        };
    }
  };

  const metaTags = getMetaTags();

  return (
    <div className={styles.mainContainer}>
      <Head>
        <title>{metaTags.title}</title>
        <meta name='description' content={metaTags.description} />
      </Head>
      <div className={styles.mypageBox}>
        <div className={styles.flexColumnDb}>
          <span
            className={`${styles.tab} ${
              activeTab === 'profile'
                ? styles.profileManagementActive
                : styles.profileManagement
            }`}
            onClick={() => setActiveTab('profile')}
          >
            프로필 관리
          </span>
          <span
            className={`${styles.tab} ${
              activeTab === 'account'
                ? styles.accountManagementActive
                : styles.accountManagement
            }`}
            onClick={() => setActiveTab('account')}
          >
            계정 관리
          </span>
          <span
            className={`${styles.tab} ${
              activeTab === 'bookmark'
                ? styles.bookmarkManagementActive
                : styles.bookmarkManagement
            }`}
            onClick={() => setActiveTab('bookmark')}
          >
            북마크
          </span>
          <span className={styles.logout} onClick={openModal}>
            로그아웃
          </span>
          <div className={styles.logoutIcon} />
          <LogoutModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleLogout}
          />
        </div>
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'account' && <Account />}
        {activeTab === 'bookmark' && <BookMark />}
      </div>
    </div>
  );
};

export default MyPage;
