import React, { useState, useEffect } from 'react';
import styles from '../../styles/Schedule.module.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const Chatting = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    // WebSocket 설정
    const newSocket = new WebSocket('wss://chat.example.com/websocket');
    setSocket(newSocket);
    
    newSocket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    
    return () => {
      newSocket.close();
    };
  }, []);
  
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  
  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.send(message);
      setMessage('');
    }
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>그룹 채팅</h1>
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
          type='text'
          value={message}
          onChange={handleMessageChange}
          className={styles.messageInput}
          placeholder='메시지를 입력하세요.'
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chatting;
