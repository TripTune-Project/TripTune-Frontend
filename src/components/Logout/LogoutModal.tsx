import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

// props의 타입을 정의합니다.
interface LogoutModalProps {
	isOpen: boolean; // boolean 타입으로 지정
	onClose: () => void; // void를 반환하는 함수 타입으로 지정
	onConfirm: () => void; // void를 반환하는 함수 타입으로 지정
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box
				sx={{
					p: 4,
					backgroundColor: 'white',
					borderRadius: 1,
					boxShadow: 24,
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<Typography variant="h6" component="h2">
					로그아웃 하시겠습니까?
				</Typography>
				<Box mt={2}>
					<Button onClick={onConfirm} variant="contained" color="primary">
						확인
					</Button>
					<Button
						onClick={onClose}
						variant="outlined"
						color="secondary"
						sx={{ ml: 2 }}
					>
						취소
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default LogoutModal;
