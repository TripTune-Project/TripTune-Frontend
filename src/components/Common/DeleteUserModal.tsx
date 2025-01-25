import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import AlertModal from '../Common/AlertModal';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

// css 모듈
// :root {
//   --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//     Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
//     "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
//     "Source Han Sans CN", sans-serif;
// }
//
// .mainContainer {
//   overflow: hidden;
// }
//
// .mainContainer,
// .mainContainer * {
//   box-sizing: border-box;
// }
//
// input,
//   select,
//   textarea,
//   button {
//   outline: 0;
// }
//
// .mainContainer {
//   position: relative;
//   width: 503px;
//   height: 506px;
//   margin: 0 auto;
// }
// .deactivateHeader {
//   position: relative;
//   width: 503px;
//   height: 72px;
//   margin: 1px 0 0 0;
//   z-index: 16;
//   overflow: visible auto;
// }
// .line {
//   position: relative;
//   width: 503px;
//   height: 1px;
//   margin: 71px 0 0 0;
//   background: url(../assets/images/aea233f5-ca9e-4c0f-a6bf-a21f560d263e.png)
//   no-repeat center;
//   background-size: cover;
//   z-index: 22;
// }
// .rectangle {
//   position: absolute;
//   width: 503px;
//   height: 72px;
//   top: 0;
//   left: 0;
//   background: #ffffff;
//   z-index: 17;
//   border-radius: 30px 0 0 0;
// }
// .title {
//   position: absolute;
//   width: 120px;
//   height: 26px;
//   top: 50%;
//   left: 37px;
//   transform: translate(0, -46.15%);
//   z-index: 19;
// }
// .tripTuneIcon {
//   position: absolute;
//   width: 35px;
//   height: 26px;
//   top: 0;
//   left: 0;
//   background: url(../assets/images/07bbf8e28075f91a8f45eef77318cf60e0061073.png)
//   no-repeat center;
//   background-size: cover;
//   z-index: 21;
// }
// .accountWithdraw {
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   position: absolute;
//   height: 24px;
//   top: 2px;
//   left: 40px;
//   color: #000000;
//   font-family: Inter, var(--default-font-family);
//   font-size: 20px;
//   font-weight: 400;
//   line-height: 24px;
//   text-align: left;
//   white-space: nowrap;
//   z-index: 20;
// }
// .closeIcon {
//   position: absolute;
//   width: 16.995px;
//   height: 17.001px;
//   top: 50%;
//   left: 449.002px;
//   background: url(../assets/images/b1f7bc29-f2f3-44e4-ad56-0d108a199664.png)
//   no-repeat center;
//   background-size: cover;
//   transform: translate(0, -52.94%);
//   z-index: 18;
// }
// .info {
//   position: relative;
//   width: 429px;
//   height: 187px;
//   margin: 26px 0 0 37px;
//   font-size: 0px;
//   z-index: 11;
//   overflow: visible auto;
//   border-radius: 10px;
// }
// .withdrawalInfo {
//   display: block;
//   position: relative;
//   height: 18px;
//   margin: 0 0 0 0;
//   color: #000000;
//   font-family: Inter, var(--default-font-family);
//   font-size: 15px;
//   font-weight: 505;
//   line-height: 18px;
//   text-align: left;
//   white-space: nowrap;
//   z-index: 15;
// }
// .card {
//   position: relative;
//   width: 429px;
//   height: 155px;
//   margin: 14px 0 0 0;
//   font-size: 0px;
//   z-index: 12;
//   overflow: visible auto;
//   border-radius: 10px;
// }
// .personalInfo {
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   position: relative;
//   width: 400px;
//   height: 155px;
//   margin: 0 0 0 12px;
//   color: #333333;
//   font-family: Inter, var(--default-font-family);
//   font-size: 11px;
//   font-weight: 500;
//   line-height: 23px;
//   text-align: left;
//   z-index: 14;
// }
// .rectangle1 {
//   position: absolute;
//   width: 429px;
//   height: 155px;
//   top: 0;
//   left: 0;
//   background: rgba(237, 249, 247, 0.3);
//   border: 2px solid #76adac;
//   z-index: 13;
//   border-radius: 10px;
// }
// .password {
//   position: relative;
//   width: 429px;
//   height: 87px;
//   margin: 29px 0 0 37px;
//   font-size: 0px;
//   z-index: 4;
//   overflow: visible auto;
// }
// .password2 {
//   display: block;
//   position: relative;
//   height: 20px;
//   margin: 0 0 0 0;
//   color: #000000;
//   font-family: Inter, var(--default-font-family);
//   font-size: 13px;
//   font-weight: 500;
//   line-height: 20px;
//   text-align: left;
//   white-space: nowrap;
//   z-index: 10;
// }
// .agreeTerms {
//   display: block;
//   position: relative;
//   height: 12px;
//   margin: 6px 0 0 0;
//   color: #f86c6c;
//   font-family: Inter, var(--default-font-family);
//   font-size: 10px;
//   font-weight: 500;
//   line-height: 12px;
//   text-align: left;
//   white-space: nowrap;
//   z-index: 9;
// }
// .passwordInput {
//   position: relative;
//   width: 429px;
//   height: 40px;
//   margin: 9px 0 0 0;
//   font-size: 0px;
//   z-index: 5;
//   overflow: hidden;
// }
// .currentPassword {
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   position: relative;
//   width: 411px;
//   height: 40px;
//   margin: 0 0 0 18px;
//   color: #c4c4c4;
//   font-family: Inter, var(--default-font-family);
//   font-size: 12px;
//   font-weight: 400;
//   line-height: 14.523px;
//   text-align: left;
//   z-index: 7;
// }
// .rectangle3 {
//   position: absolute;
//   width: 429px;
//   height: 40px;
//   top: 0;
//   left: 0;
//   background: #ffffff;
//   border: 1px solid #838282;
//   z-index: 6;
// }
// .input {
//   position: absolute;
//   width: 429px;
//   height: 40px;
//   top: 0;
//   left: 0;
//   background: transparent;
//   border: none;
//   z-index: 8;
//   outline: none;
// }
// .deactivateBtn {
//   position: relative;
//   width: 429px;
//   height: 40px;
//   margin: 15px 0 0 37px;
//   cursor: pointer;
//   background: transparent;
//   border: none;
//   z-index: 1;
// }
// .rectangle4 {
//   position: absolute;
//   width: 429px;
//   height: 40px;
//   top: 0;
//   left: 0;
//   background: #76adac;
//   z-index: 2;
// }
// .withdrawalText {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: absolute;
//   width: 429px;
//   height: 40px;
//   top: 0;
//   left: 0;
//   color: #ffffff;
//   font-family: Inter, var(--default-font-family);
//   font-size: 15px;
//   font-weight: 700;
//   line-height: 18.153px;
//   text-align: center;
//   z-index: 3;
// }
// .rectangle5 {
//   position: absolute;
//   width: 503px;
//   height: 506px;
//   top: 0;
//   left: 0;
//   background: #ffffff;
//   border-radius: 30px 0 30px 0;
//   box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.3);
// }

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const DeleteUserModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteUserModalProps) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (!password) {
      alert('비밀번호를 입력하세요.');
      return;
    }
    onConfirm(password);
  };

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      title={MODAL_MESSAGES.confirmDeleteUser.title}
      description={MODAL_MESSAGES.confirmDeleteUser.description}
    >
      {/*<div className={styles.mainContainer}>*/}
      {/*  <div className={styles.deactivateHeader}>*/}
      {/*    <div className={styles.line} />*/}
      {/*    <div className={styles.rectangle} />*/}
      {/*    <div className={styles.title}>*/}
      {/*      <div className={styles.tripTuneIcon} />*/}
      {/*      <span className={styles.accountWithdraw}>계정 탈퇴</span>*/}
      {/*    </div>*/}
      {/*    <div className={styles.closeIcon} />*/}
      {/*  </div>*/}
      {/*  <div className={styles.info}>*/}
      {/*    <span className={styles.withdrawalInfo}>탈퇴 전 안내 사항</span>*/}
      {/*    <div className={styles.card}>*/}
      {/*    <span className={styles.personalInfo}>*/}
      {/*      닉네임, 프로필 사진, 이메일을 포함한 개인정보를 삭제합니다.*/}
      {/*      <br />*/}
      {/*      작성한 일정, 채팅, 북마크 기록 모두 삭제합니다.*/}
      {/*      <br />*/}
      {/*      계정 탈퇴 진행 시 삭제한 데이터를 복구할 수 없습니다.*/}
      {/*      <br />*/}
      {/*      계정 탈퇴 처리 후에는 계정을 되돌릴 수 없으며, 해당 아이디는*/}
      {/*      영구적으로 삭제되어 재가입이 불가됩니다.*/}
      {/*    </span>*/}
      {/*      <div className={styles.rectangle1} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className={styles.password}>*/}
      {/*    <span className={styles.password2}>비밀번호</span>*/}
      {/*    <span className={styles.agreeTerms}>*/}
      {/*    ※ 현재 비밀번호를 입력하고 탈퇴하기를 누르면 위 내용에 동의하는 것으로*/}
      {/*    간주됩니다.*/}
      {/*  </span>*/}
      {/*    <div className={styles.passwordInput}>*/}
      {/*      <span className={styles.currentPassword}>현재 비밀번호</span>*/}
      {/*      <div className={styles.rectangle3} />*/}
      {/*      <input className={styles.input} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <button className={styles.deactivateBtn}>*/}
      {/*    <div className={styles.rectangle4} />*/}
      {/*    <span className={styles.withdrawalText}>탈퇴하기</span>*/}
      {/*  </button>*/}
      {/*  <div className={styles.rectangle5} />*/}
      {/*</div>*/}
      <TextField
        fullWidth
        type='password'
        label='현재 비밀번호'
        variant='outlined'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Stack direction='row' spacing={2} justifyContent='center'>
        <Button
          onClick={handleConfirm}
          variant='contained'
          color='error'
          size='large'
        >
          {MODAL_MESSAGES.confirmDeleteUser.confirmButton}
        </Button>
        <Button
          onClick={onClose}
          variant='outlined'
          color='primary'
          size='large'
        >
          {MODAL_MESSAGES.confirmDeleteUser.cancelButton}
        </Button>
      </Stack>
    </AlertModal>
  );
};

export default DeleteUserModal;
