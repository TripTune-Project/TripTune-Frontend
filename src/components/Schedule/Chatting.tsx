import React, { useState, useEffect } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import { fetchScheduleChats, sendScheduleChat } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
import { ChatUserType } from '@/types/scheduleType';

const Chatting = ({ scheduleId }: { scheduleId: number }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatUserType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  
  const loadMessages = async () => {
    const response = await fetchScheduleChats(scheduleId, page);
    if (response.success && response.data) {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...response.data?.content as any,
      ]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(response.data.currentPage < response.data.totalPages);
    } else {
      console.error('채팅 기록을 불러오는 데 실패했습니다:', response.message);
    }
  };
  
  useEffect(() => {
    loadMessages();
    
    const stompClient = new Client({
      brokerURL: `wss://13.209.177.247:8080/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    
    stompClient.onConnect = () => {
      const subscription: StompSubscription = stompClient.subscribe(
        `/schedule/${scheduleId}`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      );
    };
    
    stompClient.activate();
    setClient(stompClient);
    
    return () => {
      stompClient.deactivate();
    };
  }, [scheduleId]);
  
  const handleSendMessage = async () => {
    if (message.trim() && client) {
      client.publish({
        destination: `/schedules/${scheduleId}/chats`,
        body: JSON.stringify({ message }),
      });
      setMessage('');
      
      const response = await sendScheduleChat(scheduleId, message);
      if (!response.success) {
        console.error('메시지 전송 실패:', response.message);
      }
    }
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>그룹 채팅</h1>
      </div>
      <div className={styles.messageContainer}>
        {messages.map((user, userIndex) => (
          <div key={userIndex} className={styles.userMessages}>
            <div className={styles.userInfo}>
              <img
                src={user.profileImage}
                alt={`${user.nickname} 프로필`}
                className={styles.profileImage}
              />
              <span className={styles.nickname}>{user.nickname}</span>
            </div>
            {user.messages.map((msg) => (
              <div key={msg.messageId} className={styles.message}>
                <span>{msg.message}</span>
                <span className={styles.timestamp}>{msg.timestamp}</span>
              </div>
            ))}
          </div>
        ))}
        {hasMore && (
          <button onClick={loadMessages} className={styles.loadMoreButton}>
            더 불러오기
          </button>
        )}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.messageInput}
          placeholder="메시지를 입력하세요."
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chatting;
