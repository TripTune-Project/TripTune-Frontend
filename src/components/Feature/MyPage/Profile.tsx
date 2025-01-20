import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Mypage.module.css';
import { getMyPage } from '@/apis/MyPage/myPageApi';

const Profile = () => {
  const [userData, setUserData] = useState({
    userId: 'hyo814',
    nickname: 'hyojin',
    profileImage: '/default-profile.png',
  });
  
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
  
  return (
    <>
      <div className={styles.flexColumnF}>
        <span className={styles.profileManagement4}>프로필 관리</span>
        <div>
          <div className={styles.flexRowAeb}>
            <span className={styles.profileImage}>프로필 이미지</span>
            <Image
              className={styles.rectangle7}
              src={userData?.profileImage}
              alt="프로필 이미지"
              width={95}
              height={95}
            />
            <div className={styles.change}>변경</div>
            <span className={styles.fileUploadMessage}>
                PNG, JPG, JPEG의 확장자 파일만 업로드 가능합니다.
                <br />
                이미지는 10MB 이하만 업로드 가능합니다.
              </span>
          </div>
          <div className={styles.flexRowCc}>
            <span className={styles.id}>아이디</span>
            <span className={styles.user}>{userData?.userId}</span>
          </div>
          <div className={styles.flexRowCc8}>
            <div className={styles.rectangle9}>
              <span className={styles.userA}>{userData?.nickname}</span>
            </div>
            <span className={styles.nickname}>닉네임</span>
          </div>
          <div className={styles.rectangleB}>
            <span className={styles.save}>저장</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
