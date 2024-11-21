import React, { useState, useEffect } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatUserType } from '@/types/scheduleType';

const Chatting = ({ scheduleId }: { scheduleId: number }) => {
  const token = Cookies.get('trip-tune_at');
  const userNickname = Cookies.get('nickname');

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
      brokerURL: 'wss://13.209.177.247:8080/ws',
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
    if (message.trim() && client) {
      try {
        // TODO : 메시지 형식 고민
        const newMessage: ChatUserType = {
          nickname: userNickname || '익명',
          message,
          messageId: `${Date.now()}`,
          profileUrl: '',
          timestamp: new Date().toLocaleString(),
        };

        client.publish({
          destination: '/pub/chats',
          body: JSON.stringify({
            scheduleId,
            nickname: userNickname,
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
    <>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h1 className={styles.chatTitle}>그룹 채팅</h1>
        </div>
        <div className={styles.messageContainer}>
          {messages.map((user) => (
            <div key={user.messageId} className={styles.userMessages}>
              {user.nickname !== userNickname && (
                <div className={styles.userInfo}>
                  <Image
                    src={user.profileUrl}
                    alt={`${user.nickname} 프로필`}
                    className={styles.profileImage}
                    width={40}
                    height={40}
                  />
                  <span className={styles.nickname}>{user.nickname}</span>
                </div>
              )}
              <div
                key={user.messageId}
                className={
                  user.nickname !== userNickname
                    ? styles.sentMessage
                    : styles.receiveMessage
                }
              >
                <span>{user.message}</span>
                <span className={styles.timestamp}>
                  {new Date(user.timestamp).toLocaleTimeString()}
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
    </>
  );
};

export default Chatting;
