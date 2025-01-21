import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Mypage.module.css';
import { getMyPage, updateMyPage } from '@/apis/MyPage/myPageApi';
import { useForm } from 'react-hook-form';
import { validateNickname } from '@/utils/validation';
import { UserData, FormData } from '@/types/myPage';

const Profile = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: 'hyo814',
    nickname: 'hyojin',
    profileImage: '/default.png',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      nickname: userData.nickname,
    },
  });

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const response = await getMyPage();
        if (response.success) {
          setUserData(response.data);
          setValue('nickname', response.data.nickname); // 닉네임을 폼 필드에 반영
        } else {
          console.error('마이페이지 데이터 조회 실패:', response.message);
        }
      } catch (error) {
        console.error('마이페이지 데이터 조회 중 오류 발생:', error);
      }
    };
    fetchMyPageData();
  }, [setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSave = async (data: FormData) => {
    try {
      const response = await updateMyPage(data.nickname, selectedImage);
      if (response.success) {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        setUserData((prev) => ({ ...prev, nickname: data.nickname })); // 닉네임 업데이트
      } else {
        alert(`프로필 업데이트 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
    }
  };

  const toggleImagePopup = () => {
    setIsImagePopupOpen(!isImagePopupOpen);
  };

  return (
    <>
      <div className={styles.flexColumnF}>
        <span className={styles.profileManagement4}>프로필 관리</span>
        <div>
          <div className={styles.flexRowAeb}>
            <span className={styles.profileImage}>프로필 이미지</span>
            <Image
              className={styles.rectangle7}
              src={userData?.profileImage || '/default-profile.png'}
              alt='프로필 이미지'
              width={95}
              height={95}
              onClick={toggleImagePopup}
            />
            <div className={styles.change} onClick={toggleImagePopup}>
              변경
            </div>
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
          <form onSubmit={handleSubmit(handleSave)}>
            <div className={styles.flexRowCc8}>
              <input
                {...register('nickname', {
                  required: '닉네임을 입력해주세요.',
                  validate: validateNickname,
                })}
                placeholder='닉네임 (영문 대/소문자, 숫자 조합 4 ~ 15자리)'
                className={
                  errors.nickname
                    ? styles.inputProfileError
                    : styles.inputProfile
                }
              />
              {errors.nickname && (
                <p className={styles.inputErrorText}>
                  {errors.nickname.message}
                </p>
              )}
              <span className={styles.nickname}>닉네임</span>
            </div>
            <div className={styles.rectangleB}>
              <button type='submit' className={styles.save}>
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
      {isImagePopupOpen && (
        <div className={styles.imagePopup}>
          <div className={styles.popupContent}>
            <span className={styles.popupTitle}>프로필 이미지 변경</span>
            <div className={styles.fileInputWrapper}>
              <input
                type='file'
                accept='image/png, image/jpeg, image/jpg'
                onChange={handleImageChange}
              />
            </div>
            <div className={styles.popupActions}>
              <button className={styles.popupSave} onClick={toggleImagePopup}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
