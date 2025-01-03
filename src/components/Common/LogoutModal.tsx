import React from 'react';
import { Button, Stack } from '@mui/material';
import AlertModal from '../Common/AlertModal';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      title={MODAL_MESSAGES.confirmLogout.title}
      description={MODAL_MESSAGES.confirmLogout.description}
    >
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button onClick={onConfirm} variant="contained" color="error" size="large">
          {MODAL_MESSAGES.confirmLogout.confirmButton}
        </Button>
        <Button onClick={onClose} variant="outlined" color="primary" size="large">
          {MODAL_MESSAGES.confirmLogout.cancelButton}
        </Button>
      </Stack>
    </AlertModal>
  );
};

export default LogoutModal;
