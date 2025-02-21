import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/Mypage.module.css';
import DeleteUserModal from '@/components/Common/DeleteUserModal';
import { useRouter } from 'next/navigation';
import { useMyPage } from '@/hooks/useMyPage';
import { changeEmail, changePassword, deactivateAccount } from '@/apis/MyPage/myPageApi';
import {
  requestEmailVerification,
  verifyEmail,
} from '@/apis/Verify/emailVerifyApi';
import { validateEmail, validatePassword } from '@/utils/validation';
import { AccountPasswordFormData, AccountEmailFormData } from '@/types/myPage';
import VerificationLoading from '@/components/Common/VerificationLoading';
import { logoutApi } from '@/apis/Login/logoutApi';

type AccountFormData = AccountEmailFormData & AccountPasswordFormData;

const Account = () => {
  const router = useRouter();
  const { userData } = useMyPage();
  
  // 로딩 상태 분리
  const [emailRequestLoading, setEmailRequestLoading] = useState(false);
  const [emailConfirmLoading, setEmailConfirmLoading] = useState(false);
  // 인증 요청 성공 여부 (요청 성공 시 요청 버튼 비활성화)
  const [emailRequestSuccess, setEmailRequestSuccess] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPwd, setIsEditingPwd] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.email || '',
      verificationCode: '',
      nowPassword: '',
      newPassword: '',
      rePassword: '',
    },
  });
  
  const handleEmailVerification = async (data: AccountEmailFormData) => {
    if (!data.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    setEmailRequestLoading(true);
    try {
      const response = await requestEmailVerification(data.email);
      alert('인증 요청이 성공적으로 완료되었습니다.');
      console.log('인증 요청 응답:', response);
      setEmailRequestSuccess(true);
    } catch (error: any) {
      console.error('이메일 인증 요청 실패:', error.message);
      alert('이메일 인증 요청에 실패했습니다.');
    } finally {
      setEmailRequestLoading(false);
    }
  };
  
  const handleEmailVerificationConfirm = async (data: AccountEmailFormData) => {
    if (!data.verificationCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }
    setEmailConfirmLoading(true);
    try {
      const response = await verifyEmail(data.email, data.verificationCode);
      alert('이메일 인증이 성공적으로 완료되었습니다.');
      console.log('인증 확인 응답:', response);
    } catch (error: any) {
      console.error('이메일 인증 확인 실패:', error.message);
      alert('이메일 인증 확인에 실패했습니다.');
    } finally {
      setEmailConfirmLoading(false);
    }
  };
  
  const handleEmailSave = async (data: AccountEmailFormData) => {
    if (!data.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!data.verificationCode) {
      alert('이메일 인증을 확인해주세요.');
      return;
    }
    try {
      await changeEmail(data.email);
      alert('이메일이 성공적으로 변경되었습니다.');
      setIsEditing(false);
    } catch (error: any) {
      console.error('이메일 변경 실패:', error.message);
      alert('이메일 변경에 실패했습니다.');
    }
  };
  
  const handlePasswordChange = async (data: AccountPasswordFormData) => {
    if (!data.nowPassword || !data.newPassword || !data.rePassword) {
      alert('모든 비밀번호 필드를 입력해주세요.');
      return;
    }
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
    if (!password) {
      alert("패스워드를 입력 해야 탈퇴가 가능합니다.");
      return;
    }
    try {
      await deactivateAccount(password);
      alert('회원 탈퇴가 완료되었습니다.');
      await logoutApi();
      router.push('/');
    } catch (error: any) {
      console.error('회원 탈퇴 실패:', error.message);
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 필수 입력값 확인
  const email = watch('email');
  const verificationCode = watch('verificationCode');
  const nowPassword = watch('nowPassword');
  const newPassword = watch('newPassword');
  const rePassword = watch('rePassword');
  
  const isEmailSaveDisabled = !email || !verificationCode;
  const isPasswordSaveDisabled = !nowPassword || !newPassword || !rePassword;
  
  return (
    <div className={styles.flexColumnC}>
      <div className={styles.accountManagementTitle}>계정 관리</div>
      <div className={styles.rectangleC}>
        <div className={styles.formRow}>
          <div className={styles.rowLabel}>아이디</div>
          <div className={styles.rowField}>
            <input
              type='text'
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
                    type='text'
                    placeholder='이메일'
                    defaultValue={userData?.email || ''}
                    {...register('email', { validate: validateEmail })}
                    className={errors.email ? styles.inputError : styles.input}
                  />
                  <button
                    type='button'
                    className={styles.requestBtn}
                    onClick={() => {
                      const emailData: AccountEmailFormData = {
                        email: email || '',
                        verificationCode: verificationCode || '',
                      };
                      handleEmailVerification(emailData);
                    }}
                    disabled={emailRequestLoading || emailRequestSuccess}
                  >
                    {emailRequestLoading
                      ? <VerificationLoading />
                      : emailRequestSuccess
                        ? '인증 요청 완료'
                        : '인증 요청'}
                  </button>
                </div>
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
                <div className={styles.emailRow}>
                  <input
                    type='text'
                    placeholder='인증 코드 입력'
                    {...register('verificationCode', {
                      required: '인증 코드를 입력해주세요.',
                    })}
                    className={errors.verificationCode ? styles.inputError : styles.input}
                  />
                  <button
                    type='button'
                    className={styles.verifyBtn}
                    onClick={handleSubmit((data) => {
                      const emailData: AccountEmailFormData = {
                        email: data.email,
                        verificationCode: data.verificationCode,
                      };
                      handleEmailVerificationConfirm(emailData);
                    })}
                    disabled={emailConfirmLoading}
                  >
                    {emailConfirmLoading ? <VerificationLoading /> : '인증 확인'}
                  </button>
                </div>
                {errors.verificationCode && (
                  <p className={styles.errorText}>
                    {errors.verificationCode.message}
                  </p>
                )}
                <div className={styles.actionRow}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSubmit((data) => {
                      const emailData: AccountEmailFormData = {
                        email: data.email,
                        verificationCode: data.verificationCode,
                      };
                      handleEmailSave(emailData);
                    })}
                    disabled={isEmailSaveDisabled}
                  >
                    저장
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type='text'
                  value={userData?.email || ''}
                  readOnly
                  className={styles.input}
                />
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    if (!isEditingPwd) setIsEditing(true);
                  }}
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
                  type='password'
                  placeholder='현재 비밀번호'
                  {...register('nowPassword', { validate: validatePassword })}
                  className={errors.nowPassword ? styles.inputError : styles.input}
                />
                {errors.nowPassword && (
                  <p className={styles.errorText}>
                    {errors.nowPassword.message}
                  </p>
                )}
                <input
                  type='password'
                  placeholder='새 비밀번호 (영문 대/소문자, 숫자, 특수문자 8-15자리)'
                  {...register('newPassword', { validate: validatePassword })}
                  className={errors.newPassword ? styles.inputError : styles.input}
                />
                {errors.newPassword && (
                  <p className={styles.errorText}>
                    {errors.newPassword.message}
                  </p>
                )}
                <input
                  type='password'
                  placeholder='비밀번호 재입력'
                  {...register('rePassword', {
                    validate: (value) =>
                      value === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
                  })}
                  className={errors.rePassword ? styles.inputError : styles.input}
                />
                {errors.rePassword && (
                  <p className={styles.errorText}>
                    {errors.rePassword.message}
                  </p>
                )}
                <div className={styles.actionRow}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSubmit((data) => {
                      const passwordData: AccountPasswordFormData = {
                        nowPassword: data.nowPassword,
                        newPassword: data.newPassword,
                        rePassword: data.rePassword,
                      };
                      handlePasswordChange(passwordData);
                    })}
                    disabled={isPasswordSaveDisabled}
                  >
                    저장
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setIsEditingPwd(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type='text'
                  value='비밀번호 입력'
                  readOnly
                  className={styles.input}
                />
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    if (!isEditing) setIsEditingPwd(true);
                  }}
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
      <DeleteUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default Account;
