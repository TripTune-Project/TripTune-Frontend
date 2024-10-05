import React, { useState } from 'react';
import styles from '../../styles/Schedule.module.css';

const Chatting = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<'chat' | 'all'>('chat');
  
  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };
  
  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPermission(event.target.value as 'all' | 'chat');
  };
  
  const handleInviteConfirm = () => {
    console.log('선택된 권한:', selectedPermission);
    setIsInviteModalOpen(false);
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>채팅하기</h1>
        <button className={styles.plusButton} onClick={handleInviteClick}>
          {"+"}
        </button>
      </div>
      <div className={styles.centerContainer}>
        <button className={styles.inviteButton} onClick={handleInviteClick}>
          대화상대 초대하기
        </button>
      </div>
      <div className={styles.messageContainer}>
        {/* TODO: 여기에 실제 메시지가 표시될 것입니다. */}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.messageInput}
          placeholder="메시지를 입력하세요."
        />
        <button className={styles.sendButton}>
          전송
        </button>
      </div>
      
      {isInviteModalOpen && (
        <div className={styles.chattingModalOverlay}>
          <div className={styles.chattingModalContainer}>
            <h3>대화 상대 초대하기</h3>
            <div className={styles.radioContainer}>
              <label>
                <input
                  type="radio"
                  value="chat"
                  checked={selectedPermission === 'chat'}
                  onChange={handlePermissionChange}
                />
                채팅만 허용
              </label>
              <label>
                <input
                  type="radio"
                  value="all"
                  checked={selectedPermission === 'all'}
                  onChange={handlePermissionChange}
                />
                전체 허용
              </label>
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={handleInviteConfirm} className={styles.confirmButton}>
                초대 허용
              </button>
              <button onClick={handleCloseModal} className={styles.closeButton}>
              취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatting;
