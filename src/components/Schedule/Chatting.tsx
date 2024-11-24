import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatMessage } from '@/types/scheduleType';
import { usePathname } from 'next/navigation';

const Chatting = ({ scheduleId }: { scheduleId: number }) => {
  const pathname = usePathname();
  const token = Cookies.get('trip-tune_at');
  const userNickname = Cookies.get('nickname');
  const brokerUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BROKER_URL
      : process.env.NEXT_PUBLIC_BROKER_LOCAL_URL;
  
  const clientRef = useRef<Client | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const loadMessages = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    setLoading(true);
    try {
      const response = await fetchScheduleChats(scheduleId, page);
      if (response.success && response.data) {
        const newMessages = response.data.content.reverse();
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('메시지를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetchScheduleChats(scheduleId, 1);
        if (response.success && response.data) {
          setMessages(response.data.content.reverse());
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.totalPages);
        }
      } catch (error) {
        console.error('초기 메시지를 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    
    loadInitialMessages();
    
    const stompClient = new Client({
      brokerURL: brokerUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    
    stompClient.onConnect = () => {
      stompClient.subscribe(`/sub/schedules/${scheduleId}/chats`, (message) => {
        const newMessage: ChatMessage = JSON.parse(message.body);
        setMessages((prevMessages) => {
          if (!prevMessages.some((msg) => msg.messageId === newMessage.messageId)) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      });
    };
    
    stompClient.activate();
    clientRef.current = stompClient;
    
    return () => {
      if (clientRef.current) {
        if (clientRef.current instanceof Client) {
          clientRef.current.deactivate();
        }
        clientRef.current = null;
      }
    };
  }, [scheduleId, brokerUrl, token]);
  
  const handleSendMessage = () => {
    const stompClient = clientRef.current;
    if (message.trim() && stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/pub/chats',
        body: JSON.stringify({ scheduleId, nickname: userNickname, message }),
      });
      setMessage('');
    }
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>그룹 채팅</h1>
      </div>
      <div className={styles.messageContainer}>
        {messages.map((msg) => (
          <div key={msg.messageId} className={styles.userMessages}>
            {msg.nickname !== userNickname && (
              <div className={styles.userInfo}>
                <Image
                  src={msg.profileUrl}
                  alt={`${msg.nickname} 프로필`}
                  width={40}
                  height={40}
                  className={styles.profileImage}
                />
                <span className={styles.nickname}>{msg.nickname}</span>
              </div>
            )}
            <div
              className={
                msg.nickname === userNickname
                  ? styles.receiveMessage
                  : styles.sentMessage
              }
            >
              <span>{msg.message}</span>
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {currentPage > 1 && currentPage <= totalPages && (
          <button
            onClick={() => loadMessages(currentPage - 1)}
            className={styles.loadMoreButton}
          >
            더 불러오기
          </button>
        )}
        {loading && <DataLoading />}
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
