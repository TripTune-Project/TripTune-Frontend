import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import { CustomAlert } from './Alert';
import {
  ModalOverlay,
  ModalContent,
  DeactivateHeader,
  Rectangle,
  Title,
  AccountWithdraw,
  CloseButton,
  Divider,
  Info,
  Card,
  PasswordSection,
  PasswordLabel,
  PasswordNotice,
  PasswordInput,
  InputField,
  DeactivateButton,
  LitsItem,
  LitsItemLast,
} from './styles';

/**
 * 계정 탈퇴 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {() => void} props.onClose - 모달 닫기 핸들러
 * @param {(password: string) => void} props.onConfirm - 탈퇴 확인 핸들러
 */
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
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('warning');

  const handleAlertClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') return;
      setAlertOpen(false);
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (!password.trim()) {
      setAlertMessage('비밀번호를 입력하세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }
    onConfirm(password);
  }, [password, onConfirm]);

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  if (!isOpen) return null;

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <ModalContent>
        <DeactivateHeader>
          <Rectangle />
          <Title>
            <Image src={triptuneIcon} alt='TripTune 로고' width={24} height={24} />
            <AccountWithdraw id="delete-modal-title">계정 탈퇴</AccountWithdraw>
          </Title>
          <CloseButton 
            onClick={onClose}
            aria-label="모달 닫기"
          >
            ×
          </CloseButton>
        </DeactivateHeader>
        <Divider />
        <Info>
          <div>탈퇴 전 안내 사항</div>
          <Card role="region" aria-label="탈퇴 안내사항">
            <LitsItem>
              닉네임, 프로필 사진, 이메일을 포함한 개인정보를 삭제합니다.
            </LitsItem>
            <LitsItem>작성한 일정, 채팅, 북마크 기록 모두 삭제합니다.</LitsItem>
            <LitsItem>
              계정 탈퇴 진행 시 삭제한 데이터를 복구할 수 없습니다.
            </LitsItem>
            <LitsItem>
              계정 탈퇴 처리 후에는 계정을 되돌릴 수 없으며, 해당 이메일은
              영구적으로 삭제되어
            </LitsItem>
            <LitsItemLast>재가입이 불가됩니다.</LitsItemLast>
          </Card>
        </Info>
        <PasswordSection>
          <PasswordLabel htmlFor="password-input">비밀번호</PasswordLabel>
          <PasswordNotice>
            ※ 현재 비밀번호를 입력하고 탈퇴하기를 누르면 위 내용에 동의하는
            것으로 간주됩니다.
          </PasswordNotice>
          <PasswordInput>
            <InputField
              id="password-input"
              type='password'
              value={password}
              onChange={handlePasswordChange}
              placeholder='비밀번호를 입력하세요'
              aria-required="true"
              aria-invalid={!password.trim()}
            />
          </PasswordInput>
          <DeactivateButton 
            onClick={handleConfirm}
            aria-label="계정 탈퇴하기"
          >
            탈퇴하기
          </DeactivateButton>
        </PasswordSection>
      </ModalContent>
      <CustomAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
    </ModalOverlay>
  );
};

export default DeleteUserModal; 