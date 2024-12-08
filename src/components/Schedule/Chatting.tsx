import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatMessage } from '@/types/scheduleType';
import { useParams } from 'next/navigation';

const Chatting = () => {
  const { scheduleId } = useParams();
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
  
  // 한국 표준시(KST)로 시간 포맷팅
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12; // 0시 → 12시로 변환
    return `${ampm} ${formattedHours}시 ${minutes}분`;
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
  const loadMessages = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    setLoading(true);
    try {
      const response = await fetchScheduleChats(Number(scheduleId), page);
      if (response.success && response.data) {
        const newMessages = response.data.content;
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
        const response = await fetchScheduleChats(Number(scheduleId), 1);
        if (response.success && response.data) {
          setMessages(response.data.content);
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
      onConnect: () => {
        console.log('[STOMP] 성공적으로 연결되었습니다.');
        
        stompClient.subscribe(
          `/sub/schedules/${scheduleId}/chats`,
          (message) => {
            const newMessage: ChatMessage = JSON.parse(message.body);
            setMessages((prevMessages) => {
              const isDuplicate = prevMessages.some(
                (msg) => msg.messageId === newMessage.messageId
              );
              return isDuplicate ? prevMessages : [...prevMessages, newMessage];
            });
          }
        );
      },
      onStompError: (frame) => {
        console.error(
          '[STOMP]에서 에러가 발생했습니다:',
          frame.headers['message']
        );
        console.error('[STOMP] 추가 정보:', frame.body);
      },
    });
    
    stompClient.activate();
    clientRef.current = stompClient;
    
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
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
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    
    const lineCount = inputText.split('\n').length;
    
    if (lineCount <= 3 && inputText.length <= 1000) {
      setMessage(inputText);
    } else {
      console.warn('입력 제한 초과: 3줄 또는 1000자를 초과할 수 없습니다.');
    }
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>그룹 채팅</h1>
      </div>
      <div className={styles.messageContainer}>
        {messages.map((msg, index) => {
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].timestamp) !==
            formatDate(msg.timestamp);
          
          return (
            <div key={msg.messageId} className={styles.userMessages}>
              {showDate && (
                <div className={styles.dateSeparator}>
                  {formatDate(msg.timestamp)}
                </div>
              )}
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
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
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
          onChange={handleInputChange}
          className={styles.messageInput}
          onKeyPress={handleKeyPress}
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
