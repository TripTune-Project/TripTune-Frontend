'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoutModal from '@/components/Common/LogoutModal';
import styles from '@/styles/Mypage.module.css';
import { logoutApi } from '@/apis/Login/logoutApi';
import { getMyPage } from '@/apis/MyPage/myPageApi';

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    userId: '',
    nickname: '',
    since: '',
    profileImage: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const response = await getMyPage();
        if (response.success) {
          setUserData(response.data);
        } else {
          console.error('마이페이지 데이터 조회 실패:', response.message);
        }
      } catch (error) {
        console.error('마이페이지 데이터 조회 중 오류 발생:', error);
      }
    };

    fetchMyPageData();
  }, []);

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
      <div className={styles.header}>
        <div className={styles.photoBox}>
          <Image
            src={userData?.profileImage ?? '/default-profile.png'}
            alt='프로필 이미지'
            width={200}
            height={200}
          />
        </div>
        <div className={styles.info}>
          <p>아이디: {userData?.userId}</p>
          <p>닉네임: {userData?.nickname}</p>
          <p>가입일: {userData?.since}</p>
        </div>
        <button
          onClick={() => router.push('/MyPage/ProfileEdit')}
          className={styles.profileButton}
        >
          프로필 변경하기
        </button>
      </div>
      <div className={styles.menu}>
        <ul>
          <li onClick={() => router.push('/MyPage/Bookmark')}>북마크</li>
          <li onClick={() => router.push('/MyPage/PasswordChange')}>
            비밀번호 변경
          </li>
          <li onClick={openModal}>로그아웃</li>
        </ul>
      </div>
      <LogoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default MyPage;
