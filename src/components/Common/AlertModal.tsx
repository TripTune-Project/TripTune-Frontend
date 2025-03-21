import React from 'react';
import { Modal, Box } from '@mui/material';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AlertModal = ({
  isOpen,
  onClose,
  children,
}: AlertModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.30)',
          position: 'absolute',
          borderRadius: '10px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '414px',
          height:'230px',
          textAlign: 'center',
          outline: 'none',
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default AlertModal;
