import React from 'react';
import styled from 'styled-components';
import AlertModal from '@/components/Common/AlertModal';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <AlertModal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Title>{MODAL_MESSAGES.confirmDeleteSchedule.title}</Title>
        <Description>
          {MODAL_MESSAGES.confirmDeleteSchedule.description}
        </Description>
        <ButtonContainer>
          <CancelButton onClick={onClose}>
            {MODAL_MESSAGES.confirmDeleteSchedule.cancelButton}
          </CancelButton>
          <ConfirmButton onClick={onConfirm}>
            {MODAL_MESSAGES.confirmDeleteSchedule.confirmButton}
          </ConfirmButton>
        </ButtonContainer>
      </ModalContent>
    </AlertModal>
  );
};

export default DeleteModal;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
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
