import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/apis/chatApi';
import styles from '../../../styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatMessage } from '@/types/scheduleType';
import { useParams } from 'next/navigation';

// 날짜 포맷팅
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

// 시간 포맷팅
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 || 12;
  return `${ampm} ${formattedHours}시 ${minutes}분`;
};

const Chatting = () => {
  const { scheduleId } = useParams();
  const token = Cookies.get('trip-tune_at');
  const userNickname = Cookies.get('nickname');
  
  const clientRef = useRef<Client | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const brokerUrl = process.env.NEXT_PUBLIC_BROKER_URL;
  
  // 스크롤 맨 위로 이동
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };
  
  // 초기 메시지 로드
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetchScheduleChats(Number(scheduleId), 1);
        if (response.success) {
          setMessages(response.data.content);
          setTotalPages(response.data.totalPages);
          setCurrentPage(1);
          
          // 스크롤 맨 위로 강제 이동
          setTimeout(scrollToTop, 0);
        }
      } catch (error) {
        console.error('메시지 로드 실패:', error);
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
        stompClient.subscribe(
          `/sub/schedules/${scheduleId}/chats`,
          (message) => {
            const newMessage: ChatMessage = JSON.parse(message.body);
            
            setMessages((prev) => {
              const combinedMessages = [...prev, newMessage];
              return combinedMessages.sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime(),
              );
            });
          },
        );
      },
    });
    
    stompClient.activate();
    clientRef.current = stompClient;
    
    return () => {
      clientRef.current?.deactivate();
    };
  }, [scheduleId]);
  
  // 추가 메시지 로드
  const loadNextMessages = async () => {
    if (loading || currentPage === null || currentPage >= totalPages) return;
    setLoading(true);
    
    const previousScrollHeight = chatContainerRef.current?.scrollHeight || 0;
    
    try {
      const nextPage = currentPage + 1;
      const response = await fetchScheduleChats(Number(scheduleId), nextPage);
      
      if (response.success) {
        setMessages((prev) => {
          const combinedMessages = [...response.data.content, ...prev];
          return combinedMessages.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
        });
        setCurrentPage(nextPage);
        
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight - previousScrollHeight;
          }
        }, 0);
      }
    } catch (error) {
      console.error('다음 메시지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 스크롤 이벤트
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (
      container &&
      typeof container.scrollTop === 'number' &&
      container.scrollTop <= 10
    ) {
      loadNextMessages();
    }
  };
  
  // 메시지 전송
  const handleSendMessage = () => {
    const messageLines = message.split('\n').length;
    
    // 메시지 전송 제한 조건
    if (messageLines > 3 || message.length > 1000) {
      alert('전송 제한: 메시지는 3줄 이하 및 1000자 이하로 작성하세요.');
      return;
    }
    
    if (message.trim() && clientRef.current?.connected) {
      clientRef.current?.publish({
        destination: '/pub/chats',
        body: JSON.stringify({
          scheduleId,
          nickname: userNickname,
          message,
        }),
      });
      setMessage('');
    }
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>그룹 채팅</div>
      <div
        className={styles.messageContainer}
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{ paddingTop: messages.length < 10 ? '700px' : '0' }}
      >
        {messages.map((msg, index) => {
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].timestamp) !==
            formatDate(msg.timestamp);
          
          return (
            <div key={msg.messageId} className={styles.userMessages}>
              {showDate && (
                <div className={styles.dateSeparator}>
                  <hr className={styles.dateHr} />
                  <span className={styles.dateText}>
                    {formatDate(msg.timestamp)}
                  </span>
                  <hr className={styles.dateHr} />
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
        {loading && <DataLoading />}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          className={styles.messageInput}
          onChange={(e) => {
            const newMessage = e.target.value;
            const messageLines = newMessage.split('\n').length;
            
            // 입력 제한
            if (messageLines > 3 || newMessage.length > 1000) {
              alert('입력 제한: 메시지는 3줄 이하 및 1000자 이하로 작성하세요.');
              return;
            }
            
            setMessage(newMessage);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="메시지를 입력하세요. (최대 3줄 또는 1000자)"
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chatting;
