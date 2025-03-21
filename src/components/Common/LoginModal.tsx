import React, { useEffect } from 'react';
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
    if (window.location.pathname.includes('/Travel')) {
      window.location.reload();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <ModalOverlay style={{ marginTop: '-93px' }}>
      <ModalContent>
        <Title>{MODAL_MESSAGES.loginRequired.title}</Title>
        <Description>
          {MODAL_MESSAGES.loginRequired.description1}
          <br />
          {MODAL_MESSAGES.loginRequired.description2}
        </Description>
        <ButtonContainer>
          <CancelButton onClick={handleCancel}>
            {MODAL_MESSAGES.loginRequired.cancelButton}
          </CancelButton>
          <ConfirmButton onClick={handleLinkTogoLogin}>
            {MODAL_MESSAGES.loginRequired.confirmButton}
          </ConfirmButton>
        </ButtonContainer>
      </ModalContent>
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

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.3);
  width: 414px;
  height: 252px;
`;

const Title = styled.h2`
  margin-top: 25px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #666;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const BaseButton = styled.button`
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
`;

const CancelButton = styled(BaseButton)`
  height: 40px;
  width: 153px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;

  &:hover {
    background: #e0e0e0;
  }
`;

const ConfirmButton = styled(BaseButton)`
  height: 40px;
  width: 153px;
  background: #76adac;
  color: #fff;
  border: none;

  &:hover {
    background: #5a8f8e;
  }
`;
