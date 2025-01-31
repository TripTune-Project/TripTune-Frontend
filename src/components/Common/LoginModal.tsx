import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

const LoginModal = () => {
  const router = useRouter();

  const handleLinkTogoLogin = async () => {
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    router.push('/Login');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <ModalOverlay>
      <Modal>
        <h2>{MODAL_MESSAGES.loginRequired.title}</h2>
        <p>{MODAL_MESSAGES.loginRequired.description}</p>
        <ButtonContainer>
          <ConfirmButton onClick={handleLinkTogoLogin}>
            {MODAL_MESSAGES.loginRequired.confirmButton}
          </ConfirmButton>
          <CancelButton onClick={handleCancel}>
            {MODAL_MESSAGES.loginRequired.cancelButton}
          </CancelButton>
        </ButtonContainer>
      </Modal>
    </ModalOverlay>
  );
};

export default LoginModal;

const ModalOverlay = styled.div`
  position: fixed;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`;

const Modal = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  height: 200px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  border: none;
  padding: 10px 20px;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #f44336;
  border: none;
  padding: 10px 20px;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
`;
