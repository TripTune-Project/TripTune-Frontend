import React, { useState } from 'react';
import Image from 'next/image';
import { Attendee } from '@/types/scheduleType';

interface InviteModalProps {
  isOpen: boolean;
  scheduleId: number;
  permission: string;
  allUsers: Attendee[];
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
  permission,
  allUsers,
  onClose,
}: InviteModalProps) => {
  const [email, setEmail] = useState<string>('');
  const [selectedPermission, setSelectedPermission] =
    useState<string>(permission);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleShareClick = async () => {
    try {
      // 공유 API 호출
      console.log('공유할 이메일:', email);
      console.log('선택된 권한:', selectedPermission);
      alert('공유가 완료되었습니다.');
      onClose();
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
    }
  };

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
            type='text'
            placeholder='공유할 사용자의 이메일을 입력하세요.'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.emailInput}
          />
          <div style={styles.dropdown}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={styles.dropdownButton}
            >
              {permissions.find((p) => p.value === selectedPermission)?.label}
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
                    style={styles.dropdownItem}
                  >
                    <span style={styles.dropdownLabel}>{permission.label}</span>
                    <span style={styles.dropdownDescription}>
                      {permission.description}
                    </span>
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
    borderRadius: '8px',
    width: '500px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
  },
  dropdown: {
    position: 'relative',
  },
  dropdownButton: {
    padding: '10px 15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#f4f4f4',
    cursor: 'pointer',
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
    margin: 0,
    zIndex: 10,
  },
  dropdownItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItemHover: {
    backgroundColor: '#f0f0f0',
  },
  dropdownLabel: {
    fontWeight: 'bold',
  },
  dropdownDescription: {
    fontSize: '12px',
    color: '#888',
  },
  shareButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  userList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '20px',
  },
  userListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  userIcon: {
    borderRadius: '50%',
    marginRight: '10px',
  },
  userName: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  userPermission: {
    fontSize: '12px',
    color: '#888',
  },
};

export default InviteModal;
