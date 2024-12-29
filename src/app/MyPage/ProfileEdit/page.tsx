'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/Mypage.module.css';

const ProfileEdit = () => {
  const [nickname, setNickname] = useState('hyojin');
  const [email, setEmail] = useState('hyojin@example.com');
  const [profileImage, setProfileImage] = useState(
    'C:\\triptune\\images\\account\\image.jpg'
  );

  const router = useRouter();

  const handleNicknameChange = async () => {
    try {
      // await updateProfileApi({ nickname });
      alert('닉네임이 변경되었습니다.');
    } catch (error) {
      alert('닉네임 변경에 실패했습니다.');
    }
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImagePath = URL.createObjectURL(file); // 목업용, 실제 서버 업로드 필요
      setProfileImage(newImagePath);
      alert('프로필 사진이 변경되었습니다.');
    }
  };

  const handleProfileImageDelete = async () => {
    try {
      // await deleteProfileImageApi();
      setProfileImage('');
      alert('프로필 사진이 삭제되었습니다.');
    } catch (error) {
      alert('프로필 사진 삭제에 실패했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      // await updateProfileApi({ nickname, email });
      alert('프로필 정보가 저장되었습니다.');
      router.push('/MyPage');
    } catch (error) {
      alert('프로필 저장에 실패했습니다.');
    }
  };

  const handleWithdraw = () => {
    if (confirm('정말 회원 탈퇴를 진행하시겠습니까?')) {
      // 모달창으로 회원 탈퇴 할듯?
      // router.push("/DeleteUser");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>프로필 변경하기</h2>
      <div className={styles.formContainer}>
        <div className={styles.leftSection}>
          <div className={styles.inputGroup}>
            <label htmlFor='nickname'>닉네임</label>
            <div className={styles.inputWithButton}>
              <input
                type='text'
                id='nickname'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={styles.input}
                placeholder='닉네임'
              />
              <button
                className={styles.changeButton}
                onClick={handleNicknameChange}
              >
                닉네임 변경
              </button>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='userId'>아이디</label>
            <input
              type='text'
              id='userId'
              value='hyo814'
              className={styles.input}
              placeholder='아이디'
              readOnly
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='email'>이메일</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder='이메일'
            />
          </div>
          <button className={styles.saveButton} onClick={handleSave}>
            저장 하기
          </button>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.profilePhoto}>
            {profileImage ? (
              <>
                <Image
                  src={profileImage}
                  alt='프로필 이미지'
                  width={120}
                  height={120}
                  className={styles.photo}
                />
                <button
                  className={styles.closeButton}
                  onClick={handleProfileImageDelete}
                >
                  X
                </button>
              </>
            ) : (
              <p className={styles.photoPlaceholder}>프로필 사진 없음</p>
            )}
          </div>
          <input
            type='file'
            id='profileImage'
            accept='image/*'
            onChange={handleProfileImageChange}
            className={styles.photoInput}
          />
          <label htmlFor='profileImage' className={styles.photoChangeButton}>
            프로필 사진 변경 하기
          </label>
        </div>
      </div>
      <button className={styles.withdrawButton} onClick={handleWithdraw}>
        회원탈퇴
      </button>
    </div>
  );
};

export default ProfileEdit;
