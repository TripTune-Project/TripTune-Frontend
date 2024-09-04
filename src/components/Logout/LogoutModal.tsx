import React from 'react';
import { Modal, Box, Button, Typography, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
        <Stack direction="row" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography variant="h6" component="h2" gutterBottom>
          로그아웃 하시겠습니까?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          현재 세션이 종료되고 다시 로그인해야 합니다.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            size="large"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: '#d32f2f',
              },
            }}
          >
            확인
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
              borderColor: '#1976d2',
              '&:hover': {
                borderColor: '#115293',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            취소
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
