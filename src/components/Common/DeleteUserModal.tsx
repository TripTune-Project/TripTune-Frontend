import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import AlertModal from '../Common/AlertModal';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const DeleteUserModal = ({ isOpen, onClose, onConfirm }: DeleteUserModalProps) => {
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
      <TextField
        fullWidth
        type="password"
        label="비밀번호 입력"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button onClick={handleConfirm} variant="contained" color="error" size="large">
          {MODAL_MESSAGES.confirmDeleteUser.confirmButton}
        </Button>
        <Button onClick={onClose} variant="outlined" color="primary" size="large">
          {MODAL_MESSAGES.confirmDeleteUser.cancelButton}
        </Button>
      </Stack>
    </AlertModal>
  );
};

export default DeleteUserModal;
