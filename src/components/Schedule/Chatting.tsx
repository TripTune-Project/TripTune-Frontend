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
  const { scheduleId } = useParams(); // URL에서 scheduleId 가져오기
  const token = Cookies.get('trip-tune_at'); // 사용자 인증 토큰 가져오기
  const userNickname = Cookies.get('nickname'); // 사용자 닉네임 가져오기

  // 브로커 URL 설정 (환경별로 다르게 설정)
  const brokerUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BROKER_URL
      : process.env.NEXT_PUBLIC_BROKER_LOCAL_URL;

  const clientRef = useRef<Client | null>(null); // STOMP 클라이언트 참조
  const [message, setMessage] = useState(''); // 입력된 메시지
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 수신된 메시지들
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 한국 표준시(KST)로 타임스탬프를 포맷팅
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12; // 0시는 12시로 표시
    return `${ampm} ${formattedHours}시 ${minutes}분`;
  };

  // 날짜만 포맷팅
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // 메시지를 서버에서 가져오는 함수
  const loadMessages = async (page: number) => {
    if (page < 1 || page > totalPages) return; // 페이지 범위 검사

    setLoading(true);
    try {
      const response = await fetchScheduleChats(Number(scheduleId), page);
      if (response.success && response.data) {
        const newMessages = response.data.content;
        setMessages((prevMessages) => [...newMessages, ...prevMessages]); // 기존 메시지에 새 메시지를 추가
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('메시지를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 메시지를 로드
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetchScheduleChats(Number(scheduleId), 1);
        if (response.success && response.data) {
          setMessages(response.data.content); // 초기 메시지 설정
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.totalPages);
        }
      } catch (error) {
        console.error('초기 메시지를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    loadInitialMessages();

    // STOMP 클라이언트를 초기화
    const stompClient = new Client({
      brokerURL: brokerUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000, // 재연결 딜레이
      heartbeatIncoming: 4000, // 수신 하트비트 간격
      heartbeatOutgoing: 4000, // 송신 하트비트 간격
      onConnect: () => {
        console.log('[STOMP] 성공적으로 연결되었습니다.');

        // 메시지를 수신하는 구독
        stompClient.subscribe(
          `/sub/schedules/${scheduleId}/chats`,
          (message) => {
            const newMessage: ChatMessage = JSON.parse(message.body);
            setMessages((prevMessages) => {
              // 중복 메시지 방지
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

    stompClient.activate(); // 클라이언트 활성화
    clientRef.current = stompClient;

    // 컴포넌트 언마운트 시 STOMP 클라이언트 비활성화
    return () => {
      if (clientRef.current) {
        if (clientRef.current instanceof Client) {
          clientRef.current.deactivate();
        }
      }
    };
  }, [scheduleId, brokerUrl, token]);

  // 메시지를 전송하는 함수
  const handleSendMessage = () => {
    const stompClient = clientRef.current;
    if (message.trim() && stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/pub/chats', // 메시지 전송 경로
        body: JSON.stringify({ scheduleId, nickname: userNickname, message }),
      });
      setMessage(''); // 메시지 입력 필드 초기화
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 메시지 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;

    const lineCount = inputText.split('\n').length;

    // 메시지 길이 및 줄 수 제한 (1000자, 3줄 이하)
    if (lineCount <= 3 && inputText.length <= 1000) {
      setMessage(inputText);
    } else {
      console.warn('입력 제한 초과: 3줄 또는 1000자를 초과할 수 없습니다.');
    }
  };

  // UI 렌더링
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.chatTitle}>그룹 채팅</h1>
      </div>
      <div className={styles.messageContainer}>
        {messages.map((msg, index) => {
          // 메시지 날짜 표시
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
              {/* 다른 사용자의 메시지 정보 */}
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
              {/* 메시지 내용 */}
              <div
                className={
                  msg.nickname === userNickname
                    ? styles.receiveMessage // 사용자의 메시지 스타일
                    : styles.sentMessage // 다른 사용자의 메시지 스타일
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

        {/* 더 불러오기 버튼 */}
        {currentPage > 1 && currentPage <= totalPages && (
          <button
            onClick={() => loadMessages(currentPage - 1)}
            className={styles.loadMoreButton}
          >
            더 불러오기
          </button>
        )}

        {/* 로딩 상태 표시 */}
        {loading && <DataLoading />}
      </div>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={message}
          onChange={handleInputChange}
          className={styles.messageInput}
          onKeyPress={handleKeyPress}
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
