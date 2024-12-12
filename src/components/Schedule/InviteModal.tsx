import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Attendee } from '@/types/scheduleType';
import { fetchScheduleAttendees, shareSchedule } from '@/api/attendeeApi';
import { useParams } from 'next/navigation';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const permissions = [
  { value: 'ALL', label: '모두 허용', description: '편집 및 채팅을 허용' },
  { value: 'EDIT', label: '편집 허용', description: '편집 허용, 채팅 불가' },
  { value: 'CHAT', label: '채팅 허용', description: '편집 불가, 채팅 허용' },
  { value: 'READ', label: '읽기 허용', description: '편집 및 채팅 불가' },
];

const InviteModal = ({ isOpen, onClose }: InviteModalProps) => {
  const { scheduleId } = useParams();
  const [email, setEmail] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<string>('EDIT');
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState<boolean>(false); // 공유하기 드롭다운 상태
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [allUsers, setAllUsers] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAttendees = async () => {
      if (isOpen) {
        setIsLoading(true);
        try {
          const response = await fetchScheduleAttendees(Number(scheduleId));
          if (response.success) {
            setAllUsers(response.data || []);
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

  const toggleDropdown = (email: string) => {
    setDropdownStates((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const handleShareClick = async () => {
    try {
      const response = await shareSchedule(
        Number(scheduleId),
        email,
        selectedPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ'
      );

      if (response.success) {
        alert('공유가 완료되었습니다.');
        setAllUsers((prevUsers) => [
          ...prevUsers,
          {
            email,
            nickname: email.split('@')[0],
            profileUrl: '/default-profile.png',
            permission: selectedPermission,
          } as Attendee,
        ]);
        setEmail('');
        setSelectedPermission('EDIT');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
    }
  };

  const handlePermissionChange = async (
    email: string,
    newPermission: string
  ) => {
    try {
      const response = await shareSchedule(
        Number(scheduleId),
        email,
        newPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ'
      );
      if (response.success) {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email
              ? {
                  ...user,
                  permission: newPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ',
                }
              : user
          )
        );
        setDropdownStates((prev) => ({
          ...prev,
          [email]: false,
        }));
      } else {
        alert('권한 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('권한 변경 중 오류 발생:', error);
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
          <input
            type='email'
            placeholder='공유할 사용자의 이메일을 입력하세요.'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.emailInput}
          />
          <div style={styles.dropdownWrapper}>
            <button
              style={styles.dropdownButton}
              onClick={() => setIsMainDropdownOpen((prev) => !prev)}
            >
              {permissions.find((p) => p.value === selectedPermission)?.label ||
                '모두 허용'}
              <span style={styles.dropdownIcon}>▼</span>
            </button>
            {isMainDropdownOpen && (
              <ul style={styles.dropdownMenu}>
                {permissions.map((permission) => (
                  <li
                    key={permission.value}
                    style={styles.dropdownItem}
                    onClick={() => {
                      setSelectedPermission(permission.value);
                      setIsMainDropdownOpen(false); // 드롭다운 닫기
                    }}
                  >
                    <strong>{permission.label}</strong>
                    <p style={styles.dropdownDescription}>
                      {permission.description}
                    </p>
                    {selectedPermission === permission.value && (
                      <span style={styles.checkMark}>✔</span>
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
              <li key={user.email} style={styles.userListItem}>
                <div style={styles.userDetails}>
                  <Image
                    src={user.profileUrl}
                    alt={`${user.nickname}님의 프로필`}
                    width={38}
                    height={38}
                    style={styles.userIcon}
                  />
                  <span>{user.nickname}</span>
                  <span style={styles.userEmail}>{user.email}</span>
                </div>
                <div style={styles.dropdownWrapper}>
                  <button
                    style={{
                      ...styles.dropdownButton,
                      background: dropdownStates[user.email]
                        ? '#EDF9F7'
                        : '#fff',
                    }}
                    onClick={() => toggleDropdown(user.email)}
                  >
                    {permissions.find((p) => p.value === user.permission)
                      ?.label || '모두 허용'}
                    <span style={styles.dropdownIcon}>▼</span>
                  </button>
                  {dropdownStates[user.email] && (
                    <ul style={styles.dropdownMenu}>
                      {permissions.map((permission) => (
                        <li
                          key={permission.value}
                          style={styles.dropdownItem}
                          onClick={() =>
                            handlePermissionChange(user.email, permission.value)
                          }
                        >
                          <strong>{permission.label}</strong>
                          <p style={styles.dropdownDescription}>
                            {permission.description}
                          </p>
                          {user.permission === permission.value && (
                            <span style={styles.checkMark}>✔</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
    background: '#FFF',
    width: '591px',
    height: '417px',
    flexShrink: 0,
    borderRadius: '30px 0px',
    boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.3)',
    padding: '20px',
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
    color: '#888',
  },
  emailInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  emailInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  dropdownWrapper: {
    position: 'relative',
    width: '200px',
  },
  dropdownButton: {
    padding: '10px',
    width: '100%',
    textAlign: 'left',
    borderRadius: '4px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    background: '#EDF9F7',
  },
  dropdownIcon: {
    float: 'right',
    marginTop: '2px',
    fontSize: '12px',
    color: '#888',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    listStyle: 'none',
    padding: '5px 0',
    zIndex: 10,
    width: '230px',
  },
  dropdownItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  dropdownDescription: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '10px',
    flex: 1,
  },
  checkMark: {
    color: '#4CAF50',
    fontSize: '14px',
    marginLeft: '10px',
  },
  shareButton: {
    padding: '10px 20px',
    backgroundColor: '#76ADAC',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  userList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  userListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  userDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userEmail: {
    marginLeft: '10px',
    color: '#888',
  },
};

export default InviteModal;
