import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  TextField,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date | null, endDate: Date | null) => void;
}

const ScheduleModal = ({ isOpen, onClose, onConfirm }: ScheduleModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  const getValidDate = (date: Date | null) => date ?? new Date();
  
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
          textAlign: 'center',
          outline: 'none',
        }}
      >
        <Typography variant='h6' component='h2' mb={3}>
          일정 만들기 시작
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label='여행 이름'
            variant='outlined'
            size='small'
          />
          <Typography variant='body1'>
            날짜: {getValidDate(startDate).toLocaleDateString()} →{' '}
            {getValidDate(endDate).toLocaleDateString()}
          </Typography>
          <Stack
            direction='row'
            spacing={2}
            justifyContent='center'
            sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <DatePicker
                selected={getValidDate(startDate)}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={getValidDate(startDate)}
                endDate={getValidDate(endDate)}
                dateFormat='yyyy.MM.dd'
                monthsShown={2}
                inline
                calendarContainer={({ className, children }) => (
                  <div className={className} style={{ width: '481px' }}>
                    {children}
                  </div>
                )}
              />
            </div>
          </Stack>
        </Stack>
        <Stack direction='row' spacing={2} justifyContent='center' mt={3}>
          <Button
            onClick={onClose}
            variant='outlined'
            size='large'
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            취소
          </Button>
          <Button
            onClick={() => onConfirm(startDate, endDate)}
            variant='contained'
            size='large'
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            확인
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ScheduleModal;
