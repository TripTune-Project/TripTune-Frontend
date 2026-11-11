import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchScheduleChats } from '@/apis/Schedule/chatApi';
import { fetchScheduleAttendees } from '@/apis/Schedule/attendeeApi';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import DataLoading from '@/components/Common/DataLoading';
import { ChatMessage, ScheduleEvent } from '@/types/scheduleType';
import { useTravelStore } from '@/store/scheduleStore';
import { useParams } from 'next/navigation';
import saveLocalContent from '@/utils/saveLocalContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import {
  encodeSettlement,
  parseSettlement,
  splitAmount,
} from '@/utils/settlement';

const EMPTY_SETTLE_FORM = {
  total: '',
  people: '',
  bank: '',
  account: '',
  holder: '',
};

/**
 * 날짜 포맷팅 함수
 * YYYY년 M월 D일 요일 형식으로 날짜를 변환
 *
 * @param timestamp ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열
 */
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ][date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
};

/**
 * 시간 포맷팅 함수
 * '오전/오후 H:MM' 형식으로 시간을 변환
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
  return `${ampm} ${formattedHours}:${minutes}`;
};

/**
 * Chatting 컴포넌트 Props 인터페이스
 */
interface ChattingProps {
  onError?: (error: string) => void;
  onEvent?: (event: ScheduleEvent) => void; // 일정 이벤트 수신 시
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
const Chatting = ({ onError, onEvent }: ChattingProps) => {
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
  // 권한을 모르면 막지 않는다 (최종 판단은 서버)
  const [canChat, setCanChat] = useState(true);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);

  // 미리보기용 blob URL은 바뀌거나 언마운트될 때 해제
  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.url);
    };
  }, [photo]);
  const [settleOpen, setSettleOpen] = useState(false);
  const [settleForm, setSettleForm] = useState(EMPTY_SETTLE_FORM);

  // WebSocket 브로커 URL
  const brokerUrl = process.env.NEXT_PUBLIC_BROKER_URL;

  // Snackbar 상태 관리
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

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

  // 첫 메시지 로드 후 맨 아래(최신 메시지)로 스크롤해야 하는지 여부
  const scrollToBottomRef = useRef(false);

  // 메시지가 실제로 그려진 뒤에 스크롤해야 scrollHeight가 반영된다
  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!scrollToBottomRef.current || !container) return;
    scrollToBottomRef.current = false;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  // 최신 onEvent를 구독 콜백에서 쓰기 위해 ref로 보관 (재연결 방지)
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const attendeesUpdatedAt = useTravelStore(
    (state) => state.attendeesUpdatedAt
  );

  // 내 권한 확인: 작성자이거나 ALL·CHAT 권한일 때만 채팅 가능
  // 참석자 변경 이벤트(권한 수정 등)가 오면 다시 확인한다
  useEffect(() => {
    fetchScheduleAttendees(Number(scheduleId))
      .then((response) => {
        setAttendeeCount(response.data?.length ?? 0);
        const me = response.data?.find(
          (attendee) => attendee.nickname === userNickname
        );
        if (!me) return;
        setCanChat(
          me.role === 'AUTHOR' ||
            me.permission === 'ALL' ||
            me.permission === 'CHAT'
        );
      })
      .catch(() => {});
  }, [scheduleId, userNickname, attendeesUpdatedAt]);

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
          scrollToBottomRef.current = true;
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

              // 내가 보냈거나 이미 맨 아래 근처를 보고 있을 때만 따라 내려간다
              // (이전 메시지를 읽는 중에 남의 메시지로 끌려 내려가지 않도록)
              const container = chatContainerRef.current;
              const nearBottom =
                !!container &&
                container.scrollHeight -
                  container.scrollTop -
                  container.clientHeight <
                  100;
              if (newMessage.nickname === userNickname || nearBottom) {
                scrollToBottomRef.current = true;
              }

              setMessages((prev) => {
                const combinedMessages = [...prev, newMessage];
                return combinedMessages.sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                );
              });
            }
          );

          // 일정 이벤트 구독 (참석자·일정·여행 루트 변경)
          stompClient.subscribe(
            `/sub/schedules/${scheduleId}/events`,
            (message) => {
              if (!isMounted) return;
              onEventRef.current?.(JSON.parse(message.body));
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
          setAlertMessage(
            frame.headers['message'] || 'STOMP 에러가 발생했습니다.'
          );
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
  const showAlert = (
    text: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setAlertMessage(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  /**
   * 채팅 문자열 전송 (일반 메시지·정산 공통)
   * @returns 전송 성공 여부
   */
  const publishMessage = (text: string): boolean => {
    if (!clientRef.current?.connected) {
      showAlert(
        '채팅에 연결되어 있지 않습니다. 채팅 권한이 없거나 연결이 끊겼습니다.',
        'warning'
      );
      return false;
    }

    try {
      clientRef.current.publish({
        destination: '/pub/chats',
        body: JSON.stringify({
          scheduleId,
          nickname: userNickname,
          message: text,
        }),
      });
      return true;
    } catch (error) {
      console.error('[메시지 전송 오류]', error);
      showAlert('메시지 전송에 실패했습니다.', 'error');
      onError?.('메시지 전송에 실패했습니다.');
      return false;
    }
  };

  const handleSendMessage = () => {
    const messageLines = message.split('\n').length;
    if (messageLines > 3 || message.length > 1000) {
      showAlert('메시지는 3줄 이하 및 1000자 이하로 작성하세요.', 'warning');
      return;
    }

    if (!canChat || !message.trim()) return;

    if (publishMessage(message)) setMessage('');
  };

  const MAX_PHOTO_MB = 10;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 같은 파일을 다시 골라도 onChange가 오도록
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showAlert('이미지 파일만 선택할 수 있습니다.', 'warning');
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      showAlert(`사진은 ${MAX_PHOTO_MB}MB 이하만 보낼 수 있습니다.`, 'warning');
      return;
    }
    setAttachMenuOpen(false);
    setSettleOpen(false);
    setPhoto({ file, url: URL.createObjectURL(file) });
  };

  const openPhotoPicker = () => {
    setAttachMenuOpen(false);
    photoInputRef.current?.click();
  };

  const openSettleForm = () => {
    setPhoto(null);
    setSettleForm((prev) => ({
      ...prev,
      people: prev.people || (attendeeCount ? String(attendeeCount) : ''),
      holder: prev.holder || userNickname || '',
    }));
    setAttachMenuOpen(false);
    setSettleOpen(true);
  };

  const settleTotal = Number(settleForm.total);
  const settlePeople = Number(settleForm.people);
  const settlePreview =
    Number.isInteger(settleTotal) &&
    settleTotal > 0 &&
    Number.isInteger(settlePeople) &&
    settlePeople > 0
      ? splitAmount(settleTotal, settlePeople)
      : null;

  const handleSendSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canChat) return;

    const bank = settleForm.bank.trim();
    const account = settleForm.account.trim();
    const holder = settleForm.holder.trim();
    if (!settlePreview || settlePeople > 100) {
      showAlert('총액과 인원(1~100명)을 올바르게 입력하세요.', 'warning');
      return;
    }
    if (!bank || !holder || !/^[0-9-]{6,30}$/.test(account)) {
      showAlert('은행, 계좌번호(숫자·-), 예금주를 확인하세요.', 'warning');
      return;
    }

    const sent = publishMessage(
      encodeSettlement({
        total: settleTotal,
        people: settlePeople,
        bank,
        account,
        holder,
      })
    );
    if (sent) {
      // 다음 정산에서 계좌를 다시 치지 않도록 계좌 정보는 남긴다
      setSettleForm((prev) => ({ ...prev, total: '' }));
      setSettleOpen(false);
    }
  };

  const copyAccount = async (bank: string, account: string) => {
    try {
      await navigator.clipboard.writeText(`${bank} ${account}`);
      showAlert('계좌번호를 복사했습니다.', 'success');
    } catch {
      showAlert('복사에 실패했습니다. 직접 선택해 복사해 주세요.', 'error');
    }
  };

  const renderSettlementCard = (
    s: NonNullable<ReturnType<typeof parseSettlement>>,
    sender: string
  ) => {
    const { perPerson, remainder } = splitAmount(s.total, s.people);
    return (
      <div className={styles.settleCard}>
        <div className={styles.settleCardTitle}>정산 요청</div>
        <div className={styles.settleCardSummary}>
          총 {s.total.toLocaleString()}원 · {s.people}명
        </div>
        <div className={styles.settleCardAmount}>
          1인당 <strong>{perPerson.toLocaleString()}원</strong>
        </div>
        {remainder > 0 && (
          <div className={styles.settleCardNote}>
            나머지 {remainder.toLocaleString()}원은 {sender}님이 부담
          </div>
        )}
        <div className={styles.settleCardAccount}>
          <span>
            {s.bank} {s.account}
            <br />
            예금주 {s.holder}
          </span>
          <button
            type='button'
            className={styles.settleCopyButton}
            onClick={() => copyAccount(s.bank, s.account)}
          >
            복사
          </button>
        </div>
      </div>
    );
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
          const settlement = parseSettlement(msg.message);
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
                    ? styles.messageWithTimeRight
                    : styles.messageWithTimeLeft
                }
              >
                {msg.nickname === userNickname && (
                  <span className={styles.timestamp}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                )}
                {settlement ? (
                  renderSettlementCard(settlement, msg.nickname)
                ) : (
                  <div
                    className={
                      msg.nickname === userNickname
                        ? styles.receiveMessage
                        : styles.sentMessage
                    }
                  >
                    <span>{msg.message}</span>
                  </div>
                )}
                {msg.nickname !== userNickname && (
                  <span className={styles.timestamp}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {loading && <DataLoading />}
      </div>
      {/* 정산 입력 폼 */}
      {settleOpen && canChat && (
        <form className={styles.settleForm} onSubmit={handleSendSettlement}>
          <div className={styles.settleFormRow}>
            <label className={styles.settleField}>
              총액(원)
              <input
                type='number'
                inputMode='numeric'
                min={1}
                value={settleForm.total}
                onChange={(e) =>
                  setSettleForm({ ...settleForm, total: e.target.value })
                }
                placeholder='120000'
              />
            </label>
            <label className={styles.settleField}>
              인원
              <input
                type='number'
                inputMode='numeric'
                min={1}
                max={100}
                value={settleForm.people}
                onChange={(e) =>
                  setSettleForm({ ...settleForm, people: e.target.value })
                }
              />
            </label>
          </div>
          <div className={styles.settleFormRow}>
            <label className={styles.settleField}>
              은행
              <input
                type='text'
                maxLength={20}
                value={settleForm.bank}
                onChange={(e) =>
                  setSettleForm({ ...settleForm, bank: e.target.value })
                }
                placeholder='카카오뱅크'
              />
            </label>
            <label className={styles.settleField}>
              예금주
              <input
                type='text'
                maxLength={20}
                value={settleForm.holder}
                onChange={(e) =>
                  setSettleForm({ ...settleForm, holder: e.target.value })
                }
              />
            </label>
          </div>
          <label className={styles.settleField}>
            계좌번호
            <input
              type='text'
              inputMode='numeric'
              maxLength={30}
              value={settleForm.account}
              onChange={(e) =>
                setSettleForm({ ...settleForm, account: e.target.value })
              }
              placeholder='3333-01-1234567'
            />
          </label>
          <div className={styles.settleFormFooter}>
            <span className={styles.settlePreview}>
              {settlePreview
                ? `1인당 ${settlePreview.perPerson.toLocaleString()}원` +
                  (settlePreview.remainder
                    ? ` (나머지 ${settlePreview.remainder}원 본인 부담)`
                    : '')
                : '총액과 인원을 입력하세요'}
            </span>
            <div className={styles.settleFormActions}>
              <button
                type='button'
                className={styles.settleCancelButton}
                onClick={() => setSettleOpen(false)}
              >
                취소
              </button>
              <button type='submit' className={styles.sendButton}>
                보내기
              </button>
            </div>
          </div>
        </form>
      )}
      {/* 사진 미리보기 */}
      {photo && canChat && (
        <div className={styles.photoPreview}>
          <Image
            src={photo.url}
            alt='보낼 사진 미리보기'
            width={64}
            height={64}
            unoptimized
            className={styles.photoPreviewImage}
          />
          <div className={styles.photoPreviewInfo}>
            <span className={styles.photoPreviewName}>{photo.file.name}</span>
            <span className={styles.photoPreviewSize}>
              {photo.file.size < 1024 * 1024
                ? `${Math.ceil(photo.file.size / 1024)}KB`
                : `${(photo.file.size / 1024 / 1024).toFixed(1)}MB`}{' '}
              · 전송은 준비 중입니다
            </span>
          </div>
          <div className={styles.settleFormActions}>
            <button
              type='button'
              className={styles.settleCancelButton}
              onClick={() => setPhoto(null)}
            >
              취소
            </button>
            {/* ponytail: 채팅 사진 업로드 API가 아직 없어 전송은 막아 둠. 생기면 여기서 업로드 후 URL을 메시지로 publish */}
            <button type='button' className={styles.sendButton} disabled>
              보내기
            </button>
          </div>
        </div>
      )}
      {/* 메시지 입력 영역 */}
      <div className={styles.inputContainer}>
        <input
          ref={photoInputRef}
          type='file'
          accept='image/*'
          hidden
          onChange={handlePhotoSelect}
        />
        {attachMenuOpen && canChat && (
          <div className={styles.attachMenu} role='menu'>
            <button type='button' role='menuitem' onClick={openPhotoPicker}>
              사진
            </button>
            <button type='button' role='menuitem' onClick={openSettleForm}>
              정산
            </button>
          </div>
        )}
        <button
          type='button'
          onClick={() => setAttachMenuOpen((open) => !open)}
          className={styles.attachToggleButton}
          disabled={!canChat}
          aria-label='첨부 메뉴'
          aria-haspopup='menu'
          aria-expanded={attachMenuOpen}
        >
          +
        </button>
        <input
          type='text'
          value={message}
          className={styles.messageInput}
          disabled={!canChat}
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
          placeholder={
            canChat
              ? '메시지를 입력하세요. (최대 3줄 또는 1000자)'
              : '채팅 권한이 없습니다.'
          }
        />
        <button
          onClick={handleSendMessage}
          className={styles.sendButton}
          disabled={!canChat}
        >
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
