import React, { useState } from 'react';
import styles from '../../styles/Schedule.module.css';
import { shareSchedule } from '@/api/attendeeApi';
import { Attendee } from '@/types/scheduleType';

interface InviteModalProps {
  isOpen: boolean;
  scheduleId: number;
  permission: string;
  allUsers: Attendee[];
  onClose: () => void;
}

const InviteModal = ({
                       isOpen,
                       scheduleId,
                       permission,
                       allUsers,
                       onClose,
                     }: InviteModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<string>(permission);
  
  if (!isOpen) return null;
  
  const handleShareClick = async () => {
    try {
      const response = await shareSchedule(
        scheduleId,
        email,
        selectedPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ'
      );
      if (response.success) {
        alert('공유가 완료되었습니다.');
        onClose();
      } else {
        console.log('일정 공유 실패:', response.message);
      }
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>공유하기</h2>
          <button onClick={onClose} className={styles.closeButton}>
            X
          </button>
        </div>
        
        <div className={styles.emailInputContainer}>
          <input
            type="text"
            placeholder="공유할 사용자의 이메일을 입력하세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailInput}
          />
          <select
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
            className={styles.permissionSelect}
          >
            <option value="ALL">편집 허용</option>
            <option value="EDIT">채팅 허용</option>
            <option value="CHAT">읽기 허용</option>
          </select>
          <button className={styles.shareButton} onClick={handleShareClick}>
            공유
          </button>
        </div>
        
        <h3>공유중인 사용자</h3>
        <ul className={styles.userList}>
          {allUsers &&
            allUsers.map((user) => (
              <li key={user.userId} className={styles.userListItem}>
                <img
                  src={user.ImageSrc}
                  alt={`${user.name}'s profile`}
                  className={styles.userIcon}
                />
                <span className={styles.userName}>
                  {user.name} ({user.email})
                </span>
                <span className={styles.userPermission}>{user.permission}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default InviteModal;
