import React, { useState } from 'react';
import styles from '../../styles/Schedule.module.css';

interface User {
  id: number;
  name: string;
}

const Chatting = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  // TODO : 모의 데이터 USER -> 이메일이나 다른것으로 변경
  const [allUsers] = useState<User[]>([
    { id: 1, name: '홍길동' },
    { id: 2, name: '김철수' },
    { id: 3, name: '박영희' },
  ]);
  
  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };
  
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('메시지 전송:', message);
      setMessage('');
    }
  };
  
  const handleUserSelect = (user: User) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.id === user.id)
        ? prevSelected.filter((u) => u.id !== user.id)
        : [...prevSelected, user]
    );
  };
  
  const handleInviteConfirm = () => {
    if (selectedUsers.length > 0) {
      console.log('초대된 대화 상대:', selectedUsers);
      setIsInviteModalOpen(false);
    } else {
      console.log('선택된 대화 상대가 없습니다.');
    }
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
          value={message}
          onChange={handleMessageChange}
          className={styles.messageInput}
          placeholder="메시지를 입력하세요."
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
      
      {isInviteModalOpen && (
        <div className={styles.chattingModalOverlay}>
          <div className={styles.chattingModalContainer}>
            <h3>대화상대 초대하기</h3>
            <ul className={styles.userList}>
              {allUsers.map((user) => (
                <li key={user.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onChange={() => handleUserSelect(user)}
                    />
                    {user.name}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={handleInviteConfirm} className={styles.confirmButton}>
              초대 확인
            </button>
            <button onClick={handleCloseModal} className={styles.closeButton}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatting;
