import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { fetchScheduleChats } from '@/api/chatApi';
import styles from '../../styles/Schedule.module.css';
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
  const [currentPage, setCurrentPage] = useState<number | null>(null); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [loading, setLoading] = useState(false);
  
  // STOMP 브로커 URL 설정
  const brokerUrl = process.env.NEXT_PUBLIC_BROKER_URL;
  
  // 스크롤 최하단 이동 함수
  const scrollToBottom = (force = false) => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      
      if (force || isAtBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };
  
  // 초기 메시지 로드: 최신 페이지 데이터 가져오기
  useEffect(() => {
    const loadLatestMessages = async () => {
      try {
        const response = await fetchScheduleChats(Number(scheduleId), 1);
        if (response.success) {
          const { totalPages: pages } = response.data;
          
          // 최신 페이지 데이터 가져오기
          const latestPageResponse = await fetchScheduleChats(Number(scheduleId), pages);
          if (latestPageResponse.success) {
            setMessages(latestPageResponse.data.content); // 최신 메시지 저장
            setTotalPages(pages); // 전체 페이지 수 설정
            setCurrentPage(pages); // 최신 페이지 설정
            
            // 강제로 스크롤 이동
            setTimeout(() => scrollToBottom(true), 100);
          }
        }
      } catch (error) {
        console.error('최신 메시지 로드 실패:', error);
      }
    };
    
    loadLatestMessages();
    
    // STOMP 클라이언트 설정
    const stompClient = new Client({
      brokerURL: brokerUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[STOMP] 연결 성공');
        stompClient.subscribe(`/sub/schedules/${scheduleId}/chats`, (message) => {
          const newMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom(); // 새 메시지가 올 때 스크롤 이동
        });
      },
      onDisconnect: () => {
        console.log('[STOMP] 연결 해제');
      },
      onStompError: (frame) => {
        console.error('[STOMP] 오류 발생:', frame.headers['message']);
      },
    });
    
    stompClient.activate();
    clientRef.current = stompClient;
    
    return () => {
      console.log('[STOMP] 클라이언트 비활성화');
      clientRef.current?.deactivate();
    };
  }, [scheduleId]);
  
  // 과거 메시지 로드
  const loadPreviousMessages = async () => {
    if (loading || currentPage === null || currentPage <= 1) return; // 더 이상 페이지가 없으면 중단
    setLoading(true);
    
    const previousScrollHeight = chatContainerRef.current?.scrollHeight || 0;
    
    try {
      const prevPage = currentPage - 1; // 이전 페이지 계산
      const response = await fetchScheduleChats(Number(scheduleId), prevPage);
      
      if (response.success) {
        setMessages((prev) => [...response.data.content, ...prev]); // 과거 메시지를 앞에 추가
        setCurrentPage(prevPage); // 현재 페이지 업데이트
        
        // 이전 스크롤 위치 유지
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight - previousScrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('이전 메시지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 스크롤 이벤트: 상단에 도달하면 과거 메시지 로드
  const handleScroll = () => {
    if (chatContainerRef.current?.scrollTop === 0) {
      loadPreviousMessages();
    }
  };
  
  // 메시지 전송
  const handleSendMessage = () => {
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
        style={{ paddingTop: messages.length < 10 ? '700px' : '0' }} // 데이터가 적을 때 패딩 추가
      >
        {messages.map((msg, index) => {
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);
          
          return (
            <div key={msg.messageId} className={styles.userMessages}>
              {showDate && (
                <div className={styles.dateSeparator}>
                  <hr className={styles.dateHr} />
                  <span className={styles.dateText}>{formatDate(msg.timestamp)}</span>
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
                <span className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chatting;
