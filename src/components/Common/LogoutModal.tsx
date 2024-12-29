import React from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
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
          {MODAL_MESSAGES.confirmLogout.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' mb={3}>
          {MODAL_MESSAGES.confirmLogout.description}
        </Typography>
        <Stack direction='row' spacing={2} justifyContent='center'>
          <Button
            onClick={onConfirm}
            variant='contained'
            color='error'
            size='large'
          >
            {MODAL_MESSAGES.confirmLogout.confirmButton}
          </Button>
          <Button
            onClick={onClose}
            variant='outlined'
            color='primary'
            size='large'
          >
            {MODAL_MESSAGES.confirmLogout.cancelButton}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
