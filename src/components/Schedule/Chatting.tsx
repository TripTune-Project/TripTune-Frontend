import React, { useState, useEffect } from 'react';
import styles from '../../styles/Schedule.module.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const Chatting = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [link, setLink] = useState('https://chat.example.com');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    // 기본 채팅방 WebSocket 설정
    const newSocket = new WebSocket('wss://chat.example.com/websocket');
    setSocket(newSocket);
    
    newSocket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    
    return () => {
      newSocket.close();
    };
  }, []);
  
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
    if (message.trim() && socket) {
      socket.send(message);
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
      selectedUsers.forEach((user) => {
        console.log(`초대 링크를 ${user.email}로 전송: ${link}`);
        sendEmail(user.email, link);
      });
      setIsInviteModalOpen(false);
    } else {
      console.log('선택된 대화 상대가 없습니다.');
    }
  };
  
  const sendEmail = (email: string, link: string) => {
    // 이메일 전송을 위한 모의 함수
    console.log(`이메일 전송: ${email} - 초대 링크: ${link}`);
    // 실제 이메일 전송 로직은 백엔드 API를 통해 구현해야 합니다.
  };
  
  const handleLinkCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      console.log('링크가 클립보드에 복사되었습니다.');
    });
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
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            {msg}
          </div>
        ))}
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
            <div className={styles.linkContainer}>
              <label>
                초대 링크:
                <input
                  type="radio"
                  value={link}
                  checked={true}
                  readOnly
                />
                {link}
              </label>
              <button onClick={handleLinkCopy} className={styles.copyButton}>
                링크 복사하기
              </button>
            </div>
            <ul className={styles.userList}>
              {allUsers.map((user) => (
                <li key={user.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onChange={() => handleUserSelect(user)}
                    />
                    {user.name} ({user.email})
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
