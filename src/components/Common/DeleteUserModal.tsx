import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

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
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          textAlign: 'center',
          outline: 'none',
        }}
      >
        <Stack direction='row' justifyContent='flex-end'>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography variant='h6' component='h2' gutterBottom>
          {MODAL_MESSAGES.confirmDeleteUser.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' mb={3}>
          {MODAL_MESSAGES.confirmDeleteUser.description}
        </Typography>
        <TextField
          fullWidth
          type='password'
          label='비밀번호 입력'
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
      </Box>
    </Modal>
  );
};

export default DeleteUserModal;
