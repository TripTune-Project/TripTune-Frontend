import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchScheduleChats } from '@/apis/Schedule/chatApi';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatMessage } from '@/types/scheduleType';
import { useParams } from 'next/navigation';
import saveLocalContent from '@/utils/saveLocalContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Cookies from 'js-cookie';

/**
 * 날짜 포맷팅 함수
 * YYYY-MM-DD 형식으로 날짜를 변환
 *
 * @param timestamp ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열
 */
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

/**
 * 시간 포맷팅 함수
 * '오전/오후 H시 MM분' 형식으로 시간을 변환
 *
 * @param timestamp ISO 형식의 날짜 문자열
 * @returns 포맷된 시간 문자열
 */
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 || 12;
  return `${ampm} ${formattedHours}시 ${minutes}분`;
};

/**
 * Chatting 컴포넌트 Props 인터페이스
 */
interface ChattingProps {
  onError?: (error: string) => void;
}

/**
 * Chatting 컴포넌트 - 일정 관련 그룹 채팅 기능 구현
 * 주요 기능:
 * - WebSocket을 통한 실시간 채팅
 * - 채팅 메시지 히스토리 로드 및 페이지네이션
 * - 메시지 전송 및 표시
 *
 * @param {ChattingProps} props - 컴포넌트 props
 * @returns {JSX.Element} 채팅 컴포넌트
 */
const Chatting = ({ onError }: ChattingProps) => {
  // useParams의 반환 타입을 업데이트
  const params = useParams();
  const scheduleId = params?.scheduleId as string;
  const { getDecryptedCookie } = saveLocalContent();
  const token = Cookies.get('accessToken');
  const userNickname = getDecryptedCookie('nickname');

  // WebSocket 클라이언트 참조
  const clientRef = useRef<Client | null>(null);
  // 채팅 컨테이너 DOM 참조
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 상태 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // WebSocket 브로커 URL
  const brokerUrl = process.env.NEXT_PUBLIC_BROKER_URL;

  // Snackbar 상태 관리
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  /**
   * 알림창 닫기 핸들러
   */
  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  /**
   * 스크롤 맨 위로 이동하는 함수
   */
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  // 초기 메시지 로드 및 WebSocket 연결 설정
  useEffect(() => {
    /**
     * 초기 메시지 로드 함수
     */
    let isMounted = true;

    const loadInitialMessages = async () => {
      if (!isInitialLoad) return;
      
      try {
        const response = await fetchScheduleChats(Number(scheduleId), 1);
        if (!isMounted) return;

        if (response.success) {
          setMessages(response.data.content);
          setTotalPages(response.data.totalPages);
          setCurrentPage(1);
          setTimeout(scrollToTop, 0);
          setIsInitialLoad(false);
        } else {
          setAlertMessage(response.message as string);
          setAlertSeverity('error');
          setAlertOpen(true);
          onError?.(response.message as string);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('메시지 로드 실패:', error);
        setAlertMessage('메시지 로드에 실패했습니다.');
        setAlertSeverity('error');
        setAlertOpen(true);
        onError?.('메시지 로드에 실패했습니다.');
      }
    };

    // STOMP WebSocket 클라이언트 설정
    const setupWebSocket = () => {
      const stompClient = new Client({
        brokerURL: brokerUrl,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          if (!isMounted) return;

          stompClient.subscribe(
            `/sub/schedules/${scheduleId}/chats`,
            (message) => {
              if (!isMounted) return;
              const newMessage: ChatMessage = JSON.parse(message.body);

              setMessages((prev) => {
                const combinedMessages = [...prev, newMessage];
                return combinedMessages.sort(
                  (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
              });
            }
          );

          // 에러 메시지 구독
          stompClient.subscribe('/user/queue/errors', (message) => {
            if (!isMounted) return;
            const errorMessage = JSON.parse(message.body);
            setAlertMessage(errorMessage.message);
            setAlertSeverity('error');
            setAlertOpen(true);
          });
        },
        onStompError: (frame) => {
          if (!isMounted) return;
          setAlertMessage(frame.headers['message'] || 'STOMP 에러가 발생했습니다.');
          setAlertSeverity('error');
          setAlertOpen(true);
        },
      });

      // WebSocket 연결 활성화
      stompClient.activate();
      clientRef.current = stompClient;
    };

    // 컴포넌트 언마운트 시 연결 해제
    loadInitialMessages();
    setupWebSocket();

    return () => {
      isMounted = false;
      clientRef.current?.deactivate();
    };
  }, [scheduleId, isInitialLoad]);

  /**
   * 추가 메시지 로드 함수
   * 스크롤이 상단에 도달했을 때 이전 메시지를 더 로드
   */
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
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        setCurrentPage(nextPage);

        // 스크롤 위치 조정
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight - previousScrollHeight;
          }
        }, 0);
      } else {
        setAlertMessage(response.message as string);
        setAlertSeverity('error');
        setAlertOpen(true);
        onError?.(response.message as string);
      }
    } catch (error) {
      console.error('다음 메시지 로드 실패:', error);
      setAlertMessage('다음 메시지 로드에 실패했습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
      onError?.('다음 메시지 로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 스크롤 이벤트 핸들러
   * 스크롤이 상단에 도달하면 추가 메시지 로드
   */
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

  /**
   * 메시지 전송 핸들러
   * 입력된 메시지를 WebSocket을 통해 전송
   */
  const handleSendMessage = () => {
    const messageLines = message.split('\n').length;
    if (messageLines > 3 || message.length > 1000) {
      setAlertMessage('메시지는 3줄 이하 및 1000자 이하로 작성하세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (message.trim() && clientRef.current?.connected) {
      try {
        clientRef.current.publish({
          destination: '/pub/chats',
          body: JSON.stringify({
            scheduleId,
            nickname: userNickname,
            message,
          }),
        });
      } catch (error) {
        console.error('[메시지 전송 오류]', error);
        setAlertMessage('메시지 전송에 실패했습니다.');
        setAlertSeverity('error');
        setAlertOpen(true);
        onError?.('메시지 전송에 실패했습니다.');
      }
      setMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>그룹채팅</div>
      <div
        className={styles.messageContainer}
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => {
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].timestamp) !==
              formatDate(msg.timestamp);
          return (
            <div key={msg.messageId} className={styles.userMessages}>
              {/* 날짜가 바뀌면 날짜 구분선 표시 */}
              {showDate && (
                <div className={styles.dateSeparator}>
                  <hr className={styles.dateHr} />
                  <span className={styles.dateText}>
                    {formatDate(msg.timestamp)}
                  </span>
                  <hr className={styles.dateHr} />
                </div>
              )}
              {/* 다른 사용자 메시지일 경우 사용자 정보 표시 */}
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
              {/* 채팅 메시지 표시 */}
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
      {/* 메시지 입력 영역 */}
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={message}
          className={styles.messageInput}
          onChange={(e) => {
            const newMessage = e.target.value;
            const messageLines = newMessage.split('\n').length;
            if (messageLines > 3 || newMessage.length > 1000) {
              setAlertMessage(
                '입력 제한: 메시지는 3줄 이하 및 1000자 이하로 작성하세요.'
              );
              setAlertSeverity('warning');
              setAlertOpen(true);
              return;
            }
            setMessage(newMessage);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder='메시지를 입력하세요. (최대 3줄 또는 1000자)'
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
      {/* 알림 Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Chatting;
