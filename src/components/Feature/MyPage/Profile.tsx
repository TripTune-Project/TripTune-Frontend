import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import styles from '@/styles/Mypage.module.css';
import { getMyPage } from '@/apis/MyPage/myPageApi';

const Profile = () => {
  const [userData, setUserData] = useState({
    userId: '',
    nickname: '',
    profileImage: '',
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
    <div>
      <h3>프로필 관리</h3>
      <div>
        <div>
          <strong>프로필 이미지</strong>
          <Image
            src={userData?.profileImage ?? '/default-profile.png'}
            alt="프로필 이미지"
            width={95}
            height={95}
          />
          <button>변경</button>
          <ul>
            <li>PNG, JPG, JPEG의 확장자 파일만 업로드 가능합니다.</li>
            <li>이미지는 10MB 이하만 업로드 가능합니다.</li>
          </ul>
        </div>
        <div>
          <strong>아이디</strong>
          <p>{userData?.userId}</p>
        </div>
        <div>
          <strong>닉네임</strong>
          <p>{userData?.nickname}</p>
        </div>
        <button>저장</button>
      </div>
    </div>
  );
};

export default Profile;
