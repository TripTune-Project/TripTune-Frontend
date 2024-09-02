import React from 'react';
import { Modal, Box, Button, Typography, Stack } from '@mui/material';

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
          borderRadius: 2,
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          로그아웃 하시겠습니까?
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          현재 세션에서 로그아웃됩니다.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            onClick={onConfirm}
            variant="contained"
            color="primary"
            size="large"
          >
            확인
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            size="large"
          >
            취소
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
