import React from 'react';

interface LogoutModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;
	
	return (
		<div className="modal">
			<div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
				<h2 id="modal-title">로그아웃</h2>
				<p>정말 로그아웃하시겠습니까?</p>
				<button className="confirm-button" onClick={onConfirm}>예</button>
				<button className="cancel-button" onClick={onClose}>아니오</button>
			</div>
			<style jsx>{`
				.modal {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, 0.5);
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.modal-content {
					background-color: white;
					padding: 20px;
					border-radius: 5px;
					text-align: center;
					box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
				}
				button {
					margin: 5px;
					padding: 10px 20px;
					border: none;
					border-radius: 5px;
					cursor: pointer;
					font-size: 16px;
				}
				.confirm-button {
					background-color: #4CAF50; /* 녹색 */
					color: white;
				}
				.confirm-button:hover {
					background-color: #45a049;
				}
				.cancel-button {
					background-color: #f44336; /* 빨강 */
					color: white;
				}
				.cancel-button:hover {
					background-color: #d32f2f;
				}
			`}
			</style>
		</div>
	);
};

export default LogoutModal;
