import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/Mypage.module.css';
import DeleteUserModal from '@/components/Common/DeleteUserModal';
import { useRouter } from 'next/navigation';
import { useMyPage } from '@/hooks/useMyPage';
import { changePassword, deactivateAccount } from '@/apis/MyPage/myPageApi';
import { requestEmailVerification, verifyEmail } from '@/apis/Verify/emailVerifyApi';
import { validateEmail, validatePassword } from '@/utils/validation';
import { AccountFormData } from '@/types/myPage';

const Account = () => {
  const router = useRouter();
  const { userData, fetchUserData, isEmailLoaded } = useMyPage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPwd, setIsEditingPwd] = useState(false);
  const [emailRequestError, setEmailRequestError] = useState<string>('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AccountFormData>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.email || '',
    },
  });
  
  useEffect(() => {
    if (!isEmailLoaded) {
      fetchUserData();
    }
  }, [isEmailLoaded, fetchUserData]);
  
  const handleEmailSave = async (data: AccountFormData) => {
    if (!data.verificationCode) {
      try {
        const response = await requestEmailVerification(data.email);
        alert('이메일 인증 요청이 성공적으로 완료되었습니다.');
        setEmailRequestError('');
        console.log('인증 요청 응답:', response);
      } catch (error: any) {
        console.error('이메일 인증 요청 실패:', error.message);
        setEmailRequestError(error.message || '이메일 인증 요청에 실패했습니다.');
      }
    } else {
      try {
        const response = await verifyEmail(data.email, data.verificationCode);
        alert('이메일 인증이 성공적으로 완료되었습니다.');
        setEmailRequestError('');
        console.log('인증 확인 응답:', response);
      } catch (error: any) {
        console.error('이메일 인증 확인 실패:', error.message);
        setEmailRequestError(error.message || '이메일 인증 확인에 실패했습니다.');
      }
    }
  };
  
  const handlePasswordSave = async (data: AccountFormData) => {
    try {
      await changePassword(data.nowPassword, data.newPassword, data.rePassword);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsEditingPwd(false);
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
        <div className={styles.formRow}>
          <div className={styles.rowLabel}>아이디</div>
          <div className={styles.rowField}>
            <input
              type="text"
              value={userData?.userId || ''}
              readOnly
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.rowLabel}>이메일</div>
          <div className={styles.rowField}>
            {isEditing ? (
              <div className={styles.emailEditingContainer}>
                <div className={styles.emailRow}>
                  <input
                    type="text"
                    placeholder="이메일"
                    defaultValue={userData?.email || ''}
                    {...register('email', { validate: validateEmail })}
                    className={errors.email ? styles.inputError : styles.input}
                  />
                  <button
                    type="button"
                    className={styles.requestBtn}
                    onClick={handleSubmit(handleEmailSave)}
                  >
                    인증 요청
                  </button>
                </div>
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
                <div className={styles.emailRow}>
                  <input
                    type="text"
                    placeholder="인증 코드 입력"
                    {...register('verificationCode', { required: '인증 코드를 입력해주세요.' })}
                    className={errors.verificationCode ? styles.inputError : styles.input}
                  />
                  <button
                    type="button"
                    className={styles.verifyBtn}
                    onClick={handleSubmit(handleEmailSave)}
                  >
                    인증 확인
                  </button>
                </div>
                {errors.verificationCode && (
                  <p className={styles.errorText}>{errors.verificationCode.message}</p>
                )}
                {emailRequestError && (
                  <p className={styles.errorText}>{emailRequestError}</p>
                )}
                <div className={styles.actionRow}>
                  <button className={styles.saveBtn} onClick={handleSubmit(handleEmailSave)}>
                    저장
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={userData?.email || ''}
                  readOnly
                  className={styles.input}
                />
                <button
                  className={styles.editBtn}
                  onClick={() => { if (!isEditingPwd) setIsEditing(true); }}
                  disabled={isEditingPwd}
                >
                  변경
                </button>
              </>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.rowLabel}>비밀번호</div>
          <div className={styles.rowField}>
            {isEditingPwd ? (
              <div className={styles.passwordEditingContainer}>
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  {...register('nowPassword', { validate: validatePassword })}
                  className={errors.nowPassword ? styles.inputError : styles.input}
                />
                {errors.nowPassword && (
                  <p className={styles.errorText}>{errors.nowPassword.message}</p>
                )}
                <input
                  type="password"
                  placeholder="새 비밀번호 (영문 대/소문자, 숫자, 특수문자 8-15자리)"
                  {...register('newPassword', { validate: validatePassword })}
                  className={errors.newPassword ? styles.inputError : styles.input}
                />
                {errors.newPassword && (
                  <p className={styles.errorText}>{errors.newPassword.message}</p>
                )}
                <input
                  type="password"
                  placeholder="비밀번호 재입력"
                  {...register('rePassword', {
                    validate: (value) =>
                      value === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
                  })}
                  className={errors.rePassword ? styles.inputError : styles.input}
                />
                {errors.rePassword && (
                  <p className={styles.errorText}>{errors.rePassword.message}</p>
                )}
                <div className={styles.actionRow}>
                  <button className={styles.saveBtn} onClick={handleSubmit(handlePasswordSave)}>
                    저장
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setIsEditingPwd(false)}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input type="text" value="비밀번호 입력" readOnly className={styles.input} />
                <button
                  className={styles.editBtn}
                  onClick={() => { if (!isEditing) setIsEditingPwd(true); }}
                  disabled={isEditing}
                >
                  변경
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.accountTermination} onClick={openModal}>
        계정 탈퇴
      </div>
      <div className={styles.deleteUserVector} />
      <DeleteUserModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleDeleteUser} />
    </div>
  );
};

export default Account;
