import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Mypage.module.css';
import { useForm } from 'react-hook-form';
import { validateNickname } from '@/utils/validation';
import { useMyPage } from '@/hooks/useMyPage';
import { nickNameChange, updateMyPage } from '@/apis/MyPage/myPageApi';

const Profile = () => {
  const { userData, fetchUserData } = useMyPage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(userData?.nickname || '');
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: userData?.nickname || '',
      profileImage : userData?.profileImage || selectedImage
    },
  });
  
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  
  useEffect(() => {
    if (userData?.nickname) {
      setValue('nickname', userData.nickname);
    }
  }, [userData, setValue]);
  
  const handleFileClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg, image/jpg';
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(file);
        try {
          const response = await updateMyPage(file);
          if (response.success) {
            alert('프로필 이미지가 성공적으로 변경되었습니다.');
            await fetchUserData();
          } else {
            alert(response.message || '이미지 변경에 실패했습니다.');
          }
        } catch (error) {
          console.error('이미지 변경 중 오류 발생:', error);
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    };
    fileInput.click();
  };
  
  const handleEdit = () => {
    setTempNickname(userData?.nickname || '');
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setValue('nickname', tempNickname);
  };
  
  const handleSave = async (data: { nickname: string }) => {
    try {
      const response = await nickNameChange(data.nickname);
      if (response.success) {
        alert('닉네임이 성공적으로 변경되었습니다.');
        await fetchUserData();
        setIsEditing(false);
      } else {
        alert(response.message || '닉네임 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  
  return (
    <div className={styles.flexColumnF}>
      <span className={styles.profileManagement4}>프로필 관리</span>
      <div className={styles.profileBox}>
        <div className={styles.flexRowAeb}>
          <span className={styles.profileImage}>프로필 이미지</span>
          <Image
            className={styles.rectangle7}
            src={userData?.profileImage || '/default-profile.png'}
            alt='프로필 이미지'
            width={95}
            height={95}
            onClick={handleFileClick}
          />
          <div className={styles.change} onClick={handleFileClick}>
            변경
          </div>
          <span className={styles.fileUploadMessage}>
            • PNG, JPG, JPEG의 확장자 파일만 업로드 가능합니다.
            <br />
            • 이미지는 10MB 이하만 업로드 가능합니다.
          </span>
        </div>
        <div className={styles.flexRowCc8}>
          <span className={styles.nicknameLabel}>닉네임</span>
          {isEditing ? (
            <form onSubmit={handleSubmit(handleSave)} className={styles.nicknameEditContainer}>
              <input
                {...register('nickname', {
                  required: '닉네임을 입력해주세요.',
                  validate: validateNickname,
                })}
                placeholder='닉네임 (영문 대/소문자, 숫자 조합 4 ~ 15자리)'
                className={errors.nickname ? styles.inputProfileError : styles.inputProfile}
              />
              {errors.nickname && (
                <p className={styles.inputErrorText}>{errors.nickname.message}</p>
              )}
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>취소</button>
              <button type="submit" className={styles.saveBtn}>저장</button>
            </form>
          ) : (
            <div className={styles.nicknameDisplay}>
              <span className={styles.testUser}>{userData?.nickname}</span>
              <button type="button" className={styles.change3} onClick={handleEdit}>변경</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
