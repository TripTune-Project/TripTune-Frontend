import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/Mypage.module.css';
import DeleteUserModal from '@/components/Common/DeleteUserModal';
import { useRouter } from 'next/navigation';
import { changePassword, deactivateAccount } from '@/apis/MyPage/myPageApi';

interface AccountFormData {
  email: string;
  verificationCode: string;
  nowPassword: string;
  newPassword: string;
  rePassword: string;
}

const Account = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleDeleteUser = async () => {
    closeModal();
    // await performDeleteUser();
  };
  
  // const performDeleteUser = async (password:string) => {
  //   try {
  //     await deactivateAccount(password);
  //     router.push('/');
  //   } catch (error) {
  //     console.error('회원 탈퇴 실패했습니다. 다시 시도해 주세요.');
  //   }
  // };
  
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({ mode: 'onChange' });
  
  const onSubmit = async (data: AccountFormData) => {
    // TODO : 제대로 입력한 상태가 아닌데 제출을 시도 했을 경우
    // IF 조건문 (실패)
    // ELSE 성공 (성공)
    // await changePassword(data);
  };
  
  return (
    <>
      <div className={styles.flexColumnC}>
        <div className={styles.accountManagement}>계정 관리</div>
        <div className={styles.rectangleC}>
          <div className={styles.rectangleD}>
            <div className={styles.spanE}>저장</div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.flexColumn}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="이메일"
                  {...register('email', {
                    required: '이메일을 입력해주세요.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '유효하지 않은 이메일 형식입니다.',
                    },
                  })}
                  className={errors.email ? styles.inputError : styles.input}
                />
                <button className={styles.currentPasswordCheck}>
                  인증 요청
                </button>
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="인증 코드 입력"
                  {...register('verificationCode', {
                    required: '인증 코드를 입력해주세요.',
                  })}
                  className={
                    errors.verificationCode ? styles.inputError : styles.input
                  }
                />
                <button className={styles.newPasswordCheck}>인증 확인</button>
                {errors.verificationCode && (
                  <p className={styles.errorText}>
                    {errors.verificationCode.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className={styles.password}>이메일</div>
        </div>
        <div className={styles.rectangleCK}>
          <div className={styles.rectangleD}>
            <div className={styles.spanE}>저장</div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.flexColumn}>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  {...register('nowPassword', {
                    required: '현재 비밀번호를 입력해주세요.',
                  })}
                  className={
                    errors.nowPassword ? styles.inputError : styles.input
                  }
                />
                {errors.nowPassword && (
                  <p className={styles.errorText}>
                    {errors.nowPassword.message}
                  </p>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="새 비밀번호 (영문 대/소문자, 숫자, 특수문자 조합 8-15자리)"
                  {...register('newPassword', {
                    required: '새 비밀번호를 입력해주세요.',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 최소 8자리여야 합니다.',
                    },
                    maxLength: {
                      value: 15,
                      message: '비밀번호는 최대 15자리입니다.',
                    },
                  })}
                  className={
                    errors.newPassword ? styles.inputError : styles.input
                  }
                />
                {errors.newPassword && (
                  <p className={styles.errorText}>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="비밀번호 재입력"
                  {...register('rePassword', {
                    validate: (value) =>
                      value === watch('newPassword') ||
                      '비밀번호가 일치하지 않습니다.',
                  })}
                  className={
                    errors.rePassword ? styles.inputError : styles.input
                  }
                />
                {errors.rePassword && (
                  <p className={styles.errorText}>
                    {errors.rePassword.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className={styles.password}>비밀번호</div>
        </div>
        <div className={styles.accountTermination} onClick={openModal}>계정 탈퇴 {'>'} </div>
        <DeleteUserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteUser}
        />
      </div>
    </>
  );
};

export default Account;
