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
        const response = await fetchScheduleChats(scheduleId, 1);
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
        
        stompClient.subscribe(`/sub/schedules/${scheduleId}/chats`, (message) => {
          console.log('[STOMP] 일반 메시지를 수신했습니다:', message.body);
          const newMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prevMessages) => {
            if (
              !prevMessages.some((msg) => msg.messageId === newMessage.messageId)
            ) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        });
        console.log(`[STOMP] 일반 메시지 구독 완료: /sub/schedules/${scheduleId}/chats`);
        
        stompClient.subscribe(`/user/queue/errors`, (error) => {
          try {
            const errorMessage = JSON.parse(error.body);
            if (errorMessage.errorCode === 404) {
              console.error(`404 Error: ${errorMessage.message}`);
              alert(`404 에러: ${errorMessage.message}`);
            } else if (errorMessage.errorCode === 401) {
              console.error(`401 Error: ${errorMessage.message}`);
              alert(`권한 에러: ${errorMessage.message}`);
            } else {
              console.error(`[STOMP] 에러: ${errorMessage.message}`);
              alert(`알 수 없는 에러 발생: ${errorMessage.message}`);
            }
          } catch (parseError) {
            console.error('[STOMP] 에러 파싱 중 문제가 발생했습니다:', parseError);
          }
        });
        console.log('[STOMP] 사용자 전용 에러 메시지 구독 완료: /user/queue/errors');
      },
      onStompError: (frame) => {
        console.error('[STOMP]에서 에러가 발생했습니다:', frame.headers['message']);
        console.error('[STOMP] 추가 정보:', frame.body);
      },
      onDisconnect: () => {
        console.log('[STOMP]와의 연결이 해제되었습니다.');
      },
      onWebSocketClose: () => {
        console.warn('[STOMP] WebSocket 연결이 종료되었습니다.');
      },
      onWebSocketError: (error) => {
        console.error('[STOMP] WebSocket 오류가 발생했습니다:', error);
      },
    });
    
    console.log('[STOMP] STOMP 클라이언트를 활성화합니다...');
    stompClient.activate();
    clientRef.current = stompClient;
    
    return () => {
      if (clientRef.current) {
        console.log('[STOMP] STOMP 클라이언트를 비활성화합니다...');
        if (clientRef.current instanceof Client) {
          clientRef.current.deactivate();
        }
        clientRef.current = null;
      }
    };
  }, [scheduleId, brokerUrl, token, pathname]);
  
  const handleSendMessage = () => {
    const stompClient = clientRef.current;
    if (message.trim() && stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/pub/chats',
        body: JSON.stringify({ scheduleId, nickname: userNickname, message }),
      });
      console.log('[STOMP] 메시지를 전송했습니다:', message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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
