import React, { useState, useEffect } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
import DataLoading from '@/components/Common/DataLoading';
import { ChatUserType } from '@/types/scheduleType';

const Chatting = ({ scheduleId }: { scheduleId: number }) => {
  const token = Cookies.get('trip-tune_at');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatUserType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(
    null
  );

  const loadMessages = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchScheduleChats(scheduleId, page);
      if (response.success && response.data) {
        const newMessages = response.data.content;
        setMessages((prevMessages) => [
          ...newMessages.reverse(),
          ...prevMessages,
        ]);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetchScheduleChats(scheduleId, 1);
        if (response.success && response.data) {
          const { totalPages } = response.data;
          const latestPageResponse = await fetchScheduleChats(
            scheduleId,
            totalPages
          );
          if (latestPageResponse.success && latestPageResponse.data) {
            const initialMessages = latestPageResponse.data.content;
            setMessages(initialMessages);
            setTotalPages(totalPages);
            setCurrentPage(totalPages);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadInitialMessages();

    const stompClient = new Client({
      // TODO : URL 주의 하기
      brokerURL: process.env.NEXT_PUBLIC_BROKER_URL,
      // brokerURL: process.env.NEXT_PUBLIC_BROKER_LOCAL_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      const sub = stompClient.subscribe(
        `/sub/schedules/${scheduleId}/chats`,
        (message) => {
          const newMessage: ChatUserType = JSON.parse(message.body);
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (msg) => msg.messageId === newMessage.messageId
            );
            if (!isDuplicate) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        }
      );
      setSubscription(sub);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [scheduleId]);

  const handleSendMessage = async () => {
    const nickname = Cookies.get('nickname') as string;
    if (message.trim() && client) {
      try {
        // TODO : 메시지 형식 고민
        const newMessage: ChatUserType = {
          nickname,
          message,
          messageId: '',
          profileUrl: '',
          timestamp: '',
        };

        client.publish({
          destination: '/pub/chats',
          body: JSON.stringify({
            scheduleId,
            nickname,
            message,
          }),
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      }
    }
  };

  return (
    <div className={`${styles.chatContainer} responsive-container`}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>그룹 채팅</h1>
      </div>
      <div className={styles.messageContainer}>
        {messages.map((user) => (
          <div key={user.messageId} className={styles.userMessages}>
            <div className={styles.userInfo}>
              <img
                src={user.profileUrl}
                alt={`${user.nickname} 프로필`}
                className={styles.profileImage}
              />
              <span className={styles.nickname}>{user.nickname}</span>
            </div>
            <div key={user.messageId} className={styles.message}>
              <span>{user.message}</span>
              <span className={styles.timestamp}>{user.timestamp}</span>
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
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
