import React from 'react';
import { Button, Stack } from '@mui/material';
import AlertModal from '../../Common/AlertModal';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      title={MODAL_MESSAGES.confirmDeleteSchedule.title}
      description={MODAL_MESSAGES.confirmDeleteSchedule.description}
    >
      <Stack direction='row' spacing={2} justifyContent='center'>
        <Button
          onClick={onConfirm}
          variant='contained'
          color='error'
          size='large'
        >
          {MODAL_MESSAGES.confirmDeleteSchedule.confirmButton}
        </Button>
        <Button
          onClick={onClose}
          variant='outlined'
          color='primary'
          size='large'
        >
          {MODAL_MESSAGES.confirmDeleteSchedule.cancelButton}
        </Button>
      </Stack>
    </AlertModal>
  );
};

export default DeleteModal;
