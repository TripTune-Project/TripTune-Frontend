import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/Mypage.module.css';
import DeleteUserModal from '@/components/Common/DeleteUserModal';
import { useRouter } from 'next/navigation';
import { useMyPage } from '@/hooks/useMyPage';
import { changePassword, deactivateAccount } from '@/apis/MyPage/myPageApi';
import {
  requestEmailVerification,
  verifyEmail,
} from '@/apis/Verify/emailVerifyApi';
import { validateEmail, validatePassword } from '@/utils/validation';
import { AccountFormData } from '@/types/myPage';

const Account = () => {
  const router = useRouter();
  const { userData, fetchUserData, isEmailLoaded } = useMyPage(); // Zustand 상태 불러오기
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (!isEmailLoaded) {
      fetchUserData();
    }
  }, [isEmailLoaded, fetchUserData]);

  const handleEmailVerification = async (data: AccountFormData) => {
    try {
      const response = await requestEmailVerification(data.email);
      alert('인증 요청이 성공적으로 완료되었습니다.');
      console.log('인증 요청 응답:', response);
    } catch (error: any) {
      console.error('이메일 인증 요청 실패:', error.message);
      alert('이메일 인증 요청에 실패했습니다.');
    }
  };

  const handleEmailVerificationConfirm = async (data: AccountFormData) => {
    try {
      const response = await verifyEmail(data.email, data.verificationCode);
      alert('이메일 인증이 성공적으로 완료되었습니다.');
      console.log('인증 확인 응답:', response);
    } catch (error: any) {
      console.error('이메일 인증 확인 실패:', error.message);
      alert('이메일 인증 확인에 실패했습니다.');
    }
  };

  const handlePasswordChange = async (data: AccountFormData) => {
    try {
      await changePassword(data.nowPassword, data.newPassword, data.rePassword);
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error.message);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleDeleteUser = async (password: string) => {
    try {
      await deactivateAccount(password);
      alert('회원 탈퇴가 완료되었습니다.');
      router.push('/');
    } catch (error: any) {
      console.error('회원 탈퇴 실패:', error.message);
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.flexColumnC}>
      <div className={styles.accountManagementTitle}>계정 관리</div>
      <div className={styles.rectangleC}>
        <div className={styles.rectangleD}>
          <div className={styles.saveAccountBtn}>저장</div>
        </div>
        <div className={styles.flexColumn}>
          <form onSubmit={handleSubmit(handleEmailVerification)}>
            <div className={styles.inputGroup}>
              <input
                type='text'
                placeholder='이메일'
                defaultValue={userData?.email || ''} // Zustand에서 이메일 가져오기
                {...register('email', {
                  validate: validateEmail,
                })}
                className={errors.email ? styles.inputError : styles.input}
              />
              <button className={styles.authentication}>인증 요청</button>
              {errors.email && (
                <p className={styles.errorText}>{errors.email.message}</p>
              )}
            </div>
          </form>
          <form onSubmit={handleSubmit(handleEmailVerificationConfirm)}>
            <div className={styles.inputGroup}>
              <input
                type='text'
                placeholder='인증 코드 입력'
                {...register('verificationCode', {
                  required: '인증 코드를 입력해주세요.',
                })}
                className={
                  errors.verificationCode ? styles.inputError : styles.input
                }
              />
              <button className={styles.authenticationCheck}>인증 확인</button>
              {errors.verificationCode && (
                <p className={styles.errorText}>
                  {errors.verificationCode.message}
                </p>
              )}
            </div>
          </form>
        </div>
        <div className={styles.accountText}>이메일</div>
      </div>
      <div className={styles.rectangleCK}>
        <div className={styles.rectangleD}>
          <div className={styles.saveAccountBtn}>저장</div>
        </div>
        <form onSubmit={handleSubmit(handlePasswordChange)}>
          <div className={styles.flexColumn}>
            <div className={styles.inputGroup}>
              <input
                type='password'
                placeholder='현재 비밀번호'
                {...register('nowPassword', {
                  validate: validatePassword,
                })}
                className={
                  errors.nowPassword ? styles.inputError : styles.input
                }
              />
              {errors.nowPassword && (
                <p className={styles.errorText}>{errors.nowPassword.message}</p>
              )}
            </div>
            <div className={styles.inputGroup}>
              <input
                type='password'
                placeholder='새 비밀번호 (영문 대/소문자, 숫자, 특수문자 조합 8-15자리)'
                {...register('newPassword', {
                  validate: validatePassword,
                })}
                className={
                  errors.newPassword ? styles.inputError : styles.input
                }
              />
              {errors.newPassword && (
                <p className={styles.errorText}>{errors.newPassword.message}</p>
              )}
            </div>
            <div className={styles.inputGroup}>
              <input
                type='password'
                placeholder='비밀번호 재입력'
                {...register('rePassword', {
                  validate: (value) =>
                    value === watch('newPassword') ||
                    '비밀번호가 일치하지 않습니다.',
                })}
                className={errors.rePassword ? styles.inputError : styles.input}
              />
              {errors.rePassword && (
                <p className={styles.errorText}>{errors.rePassword.message}</p>
              )}
            </div>
          </div>
        </form>
        <div className={styles.accountText}>비밀번호</div>
      </div>
      <div className={styles.accountTermination} onClick={openModal}>
        계정 탈퇴
      </div>
      <div className={styles.deleteUserVector} />
      <DeleteUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default Account;
