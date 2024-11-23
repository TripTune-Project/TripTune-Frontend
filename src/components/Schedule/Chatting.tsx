import React, { useState, useEffect } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatMessage } from '@/types/scheduleType';
import { useRouter } from 'next/router';

const Chatting = ({ scheduleId }: { scheduleId: number }) => {
  const router = useRouter();
  const token = Cookies.get('trip-tune_at');
  const userNickname = Cookies.get('nickname');
  const brokerUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_BROKER_LOCAL_URL
      : process.env.NEXT_PUBLIC_BROKER_URL;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  
  const loadMessages = async (page: number) => {
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
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetchScheduleChats(scheduleId, 1);
        if (response.success && response.data) {
          const latestPageResponse = await fetchScheduleChats(
            scheduleId,
            response.data.totalPages
          );
          if (latestPageResponse.success && latestPageResponse.data) {
            setMessages(latestPageResponse.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.totalPages);
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    loadInitialMessages();
    
    const stompClient = new Client({
      brokerURL: brokerUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log(`[STOMP Debug]: ${msg}`),
    });
    
    const handleRouteChange = (url: string) => {
      if (!url.startsWith(`/Schedule/${scheduleId}`)) {
        if (subscription) {
          subscription.unsubscribe();
          console.log('[Unsubscribed on route change]');
        }
        if (stompClient.connected) {
          stompClient.deactivate();
          console.log('[WebSocket Deactivated on route change]');
        }
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    stompClient.onConnect = () => {
      console.log('[STOMP Connected]');
      const sub = stompClient.subscribe(
        `/sub/schedules/${scheduleId}/chats`,
        (message) => {
          const newMessage: ChatMessage = JSON.parse(message.body);
          console.log('[Message Received]:', newMessage);
          setMessages((prevMessages) => {
            if (
              !prevMessages.some(
                (msg) => msg.messageId === newMessage.messageId
              )
            ) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        }
      );
      setSubscription(sub);
    };
    
    stompClient.onStompError = (frame) => {
      console.error('[STOMP Error]:', frame.headers['message']);
      console.error('[Details]:', frame.body);
    };
    
    stompClient.onWebSocketError = (error) => {
      console.error('[WebSocket Error]:', error);
    };
    
    stompClient.activate();
    setClient(stompClient);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      if (subscription) subscription.unsubscribe();
      if (stompClient.connected) stompClient.deactivate();
    };
  }, [scheduleId, brokerUrl, token]);
  
  const handleSendMessage = () => {
    if (message.trim() && client) {
      try {
        client.publish({
          destination: '/pub/chats',
          body: JSON.stringify({ scheduleId, nickname: userNickname, message }),
        });
        console.log('[Message Sent]:', {
          scheduleId,
          nickname: userNickname,
          message,
        });
        setMessage('');
      } catch (error) {
        console.error('[Message Send Error]:', error);
      }
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
        {currentPage > 1 && (
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
