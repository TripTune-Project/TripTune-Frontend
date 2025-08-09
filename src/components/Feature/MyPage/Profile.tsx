import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Mypage.module.css';
import { useForm } from 'react-hook-form';
import { validateNickname } from '@/utils/validation';
import { useMyPage } from '@/hooks/useMyPage';
import { nickNameChange } from '@/apis/MyPage/myPageApi';
import saveLocalContent from '@/utils/saveLocalContent';
import ProfileBasicImg from '../../../../public/assets/images/마이페이지/profileImage.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Cookies from 'js-cookie';

const Profile = () => {
  const { setEncryptedCookie } = saveLocalContent();
  const { userData, fetchUserData } = useMyPage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(userData?.nickname || '');

  // Snackbar 상태 관리
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: userData?.nickname || '',
      profileImage: userData?.profileImage || ProfileBasicImg,
    },
  });

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
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSizeInBytes) {
          setAlertMessage('파일 크기는 5MB 이하로 업로드해 주세요.');
          setAlertSeverity('warning');
          setAlertOpen(true);
          return;
        }
        setSelectedImage(file);
        try {
          const formData = new FormData();
          formData.append('profileImage', file);
          const accessToken = Cookies.get('accessToken');
          const response = await fetch(
            'https://www.triptune.site/api/profiles',
            {
              method: 'PATCH',
              body: formData,
              credentials: 'include',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          if (data.success) {
            setAlertMessage('프로필 이미지가 성공적으로 변경되었습니다.');
            setAlertSeverity('success');
            setAlertOpen(true);
            await fetchUserData();
          } else {
            setAlertMessage(data.message || '이미지 변경에 실패했습니다.');
            setAlertSeverity('error');
            setAlertOpen(true);
          }
        } catch (error) {
          console.error('이미지 변경 중 오류 발생:', error);
          setAlertMessage('오류가 발생했습니다. 다시 시도해주세요.');
          setAlertSeverity('error');
          setAlertOpen(true);
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
        setEncryptedCookie('nickname', data.nickname);
        setAlertMessage('닉네임이 성공적으로 변경되었습니다.');
        setAlertSeverity('success');
        setAlertOpen(true);
        await fetchUserData();
        window.history.go(0);
        setIsEditing(false);
      } else {
        setAlertMessage(response.message || '닉네임 변경에 실패했습니다.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      setAlertMessage('오류가 발생했습니다. 다시 시도해주세요.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <div className={styles.mypageflexColumn}>
      <span className={styles.mypageTitle}>프로필 관리</span>
      <div className={styles.mypageContentBox}>
        <div className={styles.flexRowAeb}>
          <span className={styles.profileImgText}>프로필 이미지</span>
          <Image
            className={styles.profileImg}
            src={userData?.profileImage ?? ProfileBasicImg}
            alt='프로필 이미지'
            width={95}
            height={95}
            onClick={handleFileClick}
          />
          <button
            type='button'
            className={styles.changeProfileImg}
            onClick={handleFileClick}
          >
            변경
          </button>
          <span className={styles.fileUploadMessage}>
            • PNG, JPG, JPEG의 확장자 파일만 업로드 가능합니다.
            <br />• 이미지는 5MB 이하만 업로드 가능합니다.
          </span>
        </div>
        <div className={styles.flexRowCc8}>
          <span className={styles.nicknameLabel}>닉네임</span>
          {isEditing ? (
            <form
              onSubmit={handleSubmit(handleSave)}
              className={styles.nicknameEditContainer}
            >
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
              <button
                type='button'
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                취소
              </button>
              <button type='submit' className={styles.saveBtn}>
                저장
              </button>
            </form>
          ) : (
            <div className={styles.nicknameDisplay}>
              <span className={styles.testUser}>{userData?.nickname}</span>
              <button
                type='button'
                className={styles.changeNickname}
                onClick={handleEdit}
              >
                변경
              </button>
            </div>
          )}
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
