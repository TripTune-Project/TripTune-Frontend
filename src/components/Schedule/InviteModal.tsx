import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Attendee } from '@/types/scheduleType';
import { fetchScheduleAttendees, shareSchedule } from '@/api/attendeeApi';

interface InviteModalProps {
  isOpen: boolean;
  scheduleId: number;
  permission: string;
  onClose: () => void;
}

const permissions = [
  { value: 'ALL', label: '모두 허용', description: '편집 및 채팅을 허용' },
  { value: 'EDIT', label: '편집 허용', description: '편집 허용, 채팅 불가' },
  { value: 'CHAT', label: '채팅 허용', description: '편집 불가, 채팅 허용' },
  { value: 'READ', label: '읽기 허용', description: '편집 및 채팅 불가' },
];

const InviteModal = ({
                       isOpen,
                       scheduleId,
                       permission,
                       onClose,
                     }: InviteModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [selectedPermission, setSelectedPermission] =
    useState<string>(permission);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadAttendees = async () => {
      if (isOpen) {
        setIsLoading(true);
        try {
          const response = await fetchScheduleAttendees(scheduleId);
          if (response.success) {
            setAllUsers(response.data?.content || []);
          } else {
            console.error('참석자 조회 실패:', response.message);
          }
        } catch (err) {
          console.error('참석자 조회 중 오류 발생:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadAttendees();
  }, [isOpen, scheduleId]);
  
  const handleShareClick = async () => {
    try {
      const response = await shareSchedule(
        scheduleId,
        email,
        selectedPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ'
      );
      console.log(response,"response: ")
      if (response.success) {
        alert('공유가 완료되었습니다.');
        setEmail('');
        setSelectedPermission(permission);
        onClose();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2>공유하기</h2>
          <button onClick={onClose} style={styles.closeButton}>
            X
          </button>
        </div>
        
        <div style={styles.emailInputContainer}>
          <div style={styles.inputWithDropdown}>
            <input
              type="text"
              placeholder="공유할 사용자의 이메일을 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.emailInputWithDropdown}
            />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={styles.dropdownButtonInside}
            >
              {permissions.find((p) => p.value === selectedPermission)?.label || '모두 허용'}
              <span style={styles.vIcon}>▼</span>
            </button>
            {isDropdownOpen && (
              <ul style={styles.dropdownMenu}>
                {permissions.map((permission) => (
                  <li
                    key={permission.value}
                    onClick={() => {
                      setSelectedPermission(permission.value);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      ...styles.dropdownItem,
                      ...(selectedPermission === permission.value && styles.selectedDropdownItem),
                    }}
                  >
                    <span>{permission.label}</span>
                    <span style={styles.dropdownDescription}>
                      {permission.description}
                    </span>
                    {selectedPermission === permission.value && (
                      <span style={styles.checkIcon}>✔</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={handleShareClick} style={styles.shareButton}>
            공유
          </button>
        </div>
        
        <h3>공유중인 사용자</h3>
        <hr />
        {isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <ul style={styles.userList}>
            {allUsers.map((user) => (
              <li key={user.nickname} style={styles.userListItem}>
                <Image
                  src={user.profileUrl}
                  alt={`${user.nickname}'s profile`}
                  width={38}
                  height={38}
                  style={styles.userIcon}
                />
                <div style={styles.userName}>
                  <p>{user.nickname}</p>
                  <p>{user.email}</p>
                </div>
                <span style={styles.userPermission}>{user.permission}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    background: '#fff',
    width: '591px',
    height: '447px',
    borderRadius: '30px 0px',
    padding: '20px',
    boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.30)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  emailInputContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  inputWithDropdown: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  emailInputWithDropdown: {
    flex: 1,
    padding: '10px',
    paddingRight: '80px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width:'400px'
  },
  dropdownButtonInside: {
    position: 'absolute',
    right: '10px',
    padding: '10px 15px',
    backgroundColor: '#EDF9F7',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '5px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    listStyle: 'none',
    padding: '5px 0',
    width: '230px',
    marginLeft: '350px',
    zIndex: 10,
  },
  dropdownItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f8ff',
  },
  checkIcon: {
    color: '#76ADAC',
    marginLeft: '10px',
  },
  dropdownDescription: {
    fontSize: '12px',
    color: '#888',
    marginLeft: '10px',
  },
  vIcon: {
    fontSize: '12px',
    color: '#888',
  },
  shareButton: {
    padding: '10px 20px',
    backgroundColor: '#76ADAC',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width:'80px',
    height:'40px'
},
};

export default InviteModal;
