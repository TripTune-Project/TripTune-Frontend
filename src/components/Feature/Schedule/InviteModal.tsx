import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Attendee } from '@/types/scheduleType';
import {
  fetchScheduleAttendees,
  shareSchedule,
  updatePermission,
} from '@/apis/Schedule/attendeeApi';
import { useParams } from 'next/navigation';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';

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
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState<boolean>(false);
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
          attendeeId: Math.random(),
        } as Attendee,
      ]);
      setEmail('');
      setSelectedPermission('EDIT');
    }
  };

  const handlePermissionChange = async (
    attendeeId: number,
    newPermission: string
  ) => {
    try {
      const response = await updatePermission(
        Number(scheduleId),
        attendeeId,
        newPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ'
      );
      if (response.success) {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.attendeeId === attendeeId
              ? {
                  ...user,
                  permission: newPermission as 'ALL' | 'EDIT' | 'CHAT' | 'READ',
                }
              : user
          )
        );
        setDropdownStates((prev) => ({
          ...prev,
          [attendeeId]: false,
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
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Image src={triptuneIcon} alt='파비콘' width={24} height={24} />
          <ModalTitle>공유하기</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        <EmailInputContainer>
          <EmailInput
            type='email'
            placeholder='공유할 사용자의 이메일을 입력하세요.'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <DropdownWrapper>
            <DropdownButton
              onClick={() => setIsMainDropdownOpen((prev) => !prev)}
            >
              {permissions.find((p) => p.value === selectedPermission)?.label ||
                '모두 허용'}
              <DropdownIcon>▼</DropdownIcon>
            </DropdownButton>
            {isMainDropdownOpen && (
              <DropdownMenu>
                {permissions.map((permission) => (
                  <DropdownItem
                    key={permission.value}
                    onClick={() => {
                      setSelectedPermission(permission.value);
                      setIsMainDropdownOpen(false);
                    }}
                  >
                    <strong>{permission.label}</strong>
                    <DropdownDescription>
                      {permission.description}
                    </DropdownDescription>
                    {selectedPermission === permission.value && (
                      <CheckMark>✔</CheckMark>
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </DropdownWrapper>
          <ShareButton onClick={handleShareClick}>공유</ShareButton>
        </EmailInputContainer>

        <UserListHeader>
          <UserListTitle>공유중인 사용자</UserListTitle>
          <NoticeText>※ 사용자는 최대 5명까지 공유 가능합니다.</NoticeText>
        </UserListHeader>
        <Divider />
        {isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <UserList>
            {allUsers.map((user) => (
              <UserListItem key={user.email}>
                <UserDetails>
                  <Image
                    src={user.profileUrl}
                    alt={`${user.nickname}님의 프로필`}
                    width={38}
                    height={38}
                  />
                  <span>{user.nickname}</span>
                  <UserEmail>{user.email}</UserEmail>
                </UserDetails>
                {user.role === 'AUTHOR' ? (
                  <AuthorLabel>작성자</AuthorLabel>
                ) : (
                  <DropdownWrapper>
                    <DropdownButton onClick={() => toggleDropdown(user.email)}>
                      {permissions.find((p) => p.value === user.permission)
                        ?.label || '모두 허용'}
                      <DropdownIcon>▼</DropdownIcon>
                    </DropdownButton>
                    {dropdownStates[user.email] && (
                      <DropdownMenu>
                        {permissions.map((permission) => (
                          <DropdownItem
                            key={permission.value}
                            onClick={() =>
                              handlePermissionChange(
                                user.attendeeId,
                                permission.value
                              )
                            }
                          >
                            <strong>{permission.label}</strong>
                            <DropdownDescription>
                              {permission.description}
                            </DropdownDescription>
                            {user.permission === permission.value && (
                              <CheckMark>✔</CheckMark>
                            )}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    )}
                  </DropdownWrapper>
                )}
              </UserListItem>
            ))}
          </UserList>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default InviteModal;

// Styled-components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  width: 591px;
  border-radius: 30px 0px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 20px;
  margin-left: 75%;
`;

const EmailInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 200px;
`;

const DropdownButton = styled.button`
  padding: 10px;
  width: 100%;
  text-align: left;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #edf9f7;
`;

const DropdownIcon = styled.span`
  float: right;
  margin-top: 2px;
  font-size: 12px;
  color: #888;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 5px 0;
  z-index: 10;
  width: 230px;
`;

const DropdownItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
`;

const DropdownDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin-left: 10px;
  flex: 1;
`;

const CheckMark = styled.span`
  color: #4caf50;
  font-size: 14px;
  margin-left: 10px;
`;

const ShareButton = styled.button`
  padding: 10px 20px;
  background-color: #76adac;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
`;

const UserListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserListTitle = styled.h3`
  margin: 0;
`;

const NoticeText = styled.p`
  color: red;
  font-size: 12px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserEmail = styled.span`
  margin-left: 10px;
  color: #888;
`;

const AuthorLabel = styled.span`
  display: flex;
  width: 89px;
  height: 34px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  text-align: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background-color: whitesmoke;
`;

const ModalTitle = styled.h1`
  color: #000;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 400;
`;
