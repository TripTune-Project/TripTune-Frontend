import React, { useState } from 'react';
import styled from 'styled-components';
import triptuneIcon from '../../../public/assets/images/로고/triptuneIcon-removebg.png';
import Image from 'next/image';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    position: relative;
    width: 503px;
    height: 550px;
    background: #ffffff;
    border-radius: 30px 0 30px 0;
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.3);
    overflow: hidden;
`;

const DeactivateHeader = styled.div`
    position: relative;
    width: 503px;
    height: 72px;
    z-index: 16;
`;

const Rectangle = styled.div`
    position: absolute;
    width: 503px;
    height: 72px;
    top: 0;
    left: 0;
    background: #ffffff;
    border-radius: 30px 0 0 0;
`;

const Title = styled.div`
    position: absolute;
    top: 50%;
    left: 37px;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;
`;

const AccountWithdraw = styled.span`
    margin-left: 10px;
    font-size: 20px;
    font-weight: 400;
    color: #000000;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #000;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 0;
`;

const Info = styled.div`
    position: relative;
    width: 429px;
    margin: 26px auto;
    font-size: 15px;
    line-height: 18px;
    color: #000000;
`;

const Card = styled.div`
    position: relative;
    width: 429px;
    height: 155px;
    margin: 14px 0;
    background: rgba(237, 249, 247, 0.3);
    border: 2px solid #76adac;
    border-radius: 10px;
    color: #333333;
    font-size: 11px;
    line-height: 23px;
`;

const PasswordSection = styled.div`
    position: relative;
    width: 429px;
    margin: 29px auto;
`;

const PasswordLabel = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 8px;
`;

const PasswordNotice = styled.div`
    font-size: 10px;
    color: #f86c6c;
    margin-bottom: 10px;
`;

const PasswordInput = styled.div`
    position: relative;
    width: 429px;
    height: 40px;
    margin-top: 9px;
    border: 1px solid #838282;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0 10px;
`;

const InputField = styled.input`
    width: 100%;
    border: none;
    outline: none;
    font-size: 14px;
`;

const DeactivateButton = styled.button`
    position: relative;
    width: 429px;
    height: 40px;
    margin: 15px auto;
    cursor: pointer;
    background: #76adac;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: #5d8c8b;
    }
`;

const LitsItem = styled.li`
    margin-top: 12px;
    margin-left: 20px;
    line-height: 1.6;
`;

const LitsItemLast = styled.div`
    margin-top: 12px;
    margin-left: 35px;
    line-height: 1.6;
`;

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
  // Snackbar 상태
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('warning');
  
  const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };
  
  const handleConfirm = () => {
    if (!password.trim()) {
      setAlertMessage('비밀번호를 입력하세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }
    onConfirm(password);
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <DeactivateHeader>
          <Rectangle />
          <Title>
            <Image src={triptuneIcon} alt='파비콘' width={24} height={24} />
            <AccountWithdraw>계정 탈퇴</AccountWithdraw>
          </Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </DeactivateHeader>
        <Divider />
        <Info>
          <div>탈퇴 전 안내 사항</div>
          <Card>
            <LitsItem>
              닉네임, 프로필 사진, 이메일을 포함한 개인정보를 삭제합니다.
            </LitsItem>
            <LitsItem>작성한 일정, 채팅, 북마크 기록 모두 삭제합니다.</LitsItem>
            <LitsItem>
              계정 탈퇴 진행 시 삭제한 데이터를 복구할 수 없습니다.
            </LitsItem>
            <LitsItem>
              계정 탈퇴 처리 후에는 계정을 되돌릴 수 없으며, 해당 아이디는
              영구적으로 삭제되어
            </LitsItem>
            <LitsItemLast>재가입이 불가됩니다.</LitsItemLast>
          </Card>
        </Info>
        <PasswordSection>
          <PasswordLabel>비밀번호</PasswordLabel>
          <PasswordNotice>
            ※ 현재 비밀번호를 입력하고 탈퇴하기를 누르면 위 내용에 동의하는
            것으로 간주됩니다.
          </PasswordNotice>
          <PasswordInput>
            <InputField
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='현재 비밀번호'
            />
          </PasswordInput>
        </PasswordSection>
        <DeactivateButton onClick={handleConfirm}>탈퇴하기</DeactivateButton>
      </ModalContent>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ModalOverlay>
  );
};

export default DeleteUserModal;
