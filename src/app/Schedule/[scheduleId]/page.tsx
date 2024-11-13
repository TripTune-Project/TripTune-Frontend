'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import InviteModal from '@/components/Schedule/InviteModal'; // InviteModal 임포트
import styles from '../../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';
import useAuth from '@/hooks/useAuth';

interface User {
  id: number;
  name: string;
  email: string;
  permission: string;
}

interface PageProps {
  params: {
    scheduleId: string;
  };
}

export default function ScheduleDetail({ params }: PageProps) {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // 서버에서 받아온 사용자 목록
  const [permission, setPermission] = useState('edit'); // 초기 권한 상태
  const { checkAuthStatus } = useAuth();
  
  const scheduleId = parseInt(params.scheduleId, 10);
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  useEffect(() => {
    // 서버에서 사용자 목록 데이터를 가져오는 함수
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?scheduleId=${scheduleId}`); // 일정 ID를 포함하여 사용자 목록 요청
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error('사용자 목록을 가져오는 중 오류 발생:', error);
      }
    };
    
    fetchUsers();
  }, [scheduleId]);
  
  const handleAddMarker = (marker: { lat: number; lng: number }) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };
  
  const handleShareClick = () => {
    setIsInviteModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };
  
  const handleLinkCopy = () => {
    navigator.clipboard.writeText('초대 링크를 여기에 넣습니다.');
    alert('초대 링크가 복사되었습니다.');
  };
  
  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermission(event.target.value);
  };
  
  const handleUserSelect = (user: User) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((u) => u.id === user.id)) {
        return prevSelectedUsers.filter((u) => u.id !== user.id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };
  
  const handleInviteConfirm = () => {
    alert('사용자 초대가 완료되었습니다.');
    setIsInviteModalOpen(false);
  };
  
  return (
    <>
      <Head>
        <title>일정 상세 페이지 - 지도와 함께 만드는 나만의 일정</title>
        <meta
          name="description"
          content="지도를 활용하여 여행지와 일정을 관리하고 저장할 수 있는 페이지입니다. 원하는 위치를 추가하고 일정을 계획해 보세요."
        />
        <meta
          name="keywords"
          content="일정 만들기, 지도 일정 관리, 여행 계획, 일정 저장"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="일정 상세 페이지 - 지도와 함께 만드는 나만의 일정"
        />
        <meta
          property="og:description"
          content="지도를 활용해 위치를 추가하며 나만의 일정을 만들어보세요. 여행을 보다 체계적으로 계획할 수 있습니다."
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <button className={styles.scheduleUpdateBtn}>저장</button>
      <button className={styles.scheduleShareBtn} onClick={handleShareClick}>공유</button>
      
      <InviteModal
        isOpen={isInviteModalOpen}
        permission={permission}
        allUsers={allUsers}
        selectedUsers={selectedUsers}
        onClose={handleCloseModal}
        onLinkCopy={handleLinkCopy}
        onPermissionChange={handlePermissionChange}
        onUserSelect={handleUserSelect}
        onInviteConfirm={handleInviteConfirm}
      />
      
      <div className={styles.layoutContainer}>
        <div className={styles.leftSection}>
          <ScheduleMake
            scheduleId={scheduleId}
            initialTab="scheduleTravel"
            onAddMarker={handleAddMarker}
          />
        </div>
        <div className={styles.centerSection}>
          <PlacesScheduleMap markers={markers} />
        </div>
        <div className={styles.rightSection}>
          <Chatting />
        </div>
      </div>
    </>
  );
}
