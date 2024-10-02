'use client';

import React, { useState, useEffect } from 'react';
import ScheduleModal from '../../components/Schedule/ScheduleModal';

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleConfirm = (startDate: Date | null, endDate: Date | null) => {
    console.log('시작 날짜:', startDate);
    console.log('종료 날짜:', endDate);
    handleCloseModal();
  };
  
  useEffect(() => {
    setIsModalOpen(true);
  }, []);
  
  return (
    <div>
      <h1>스케줄 작성</h1>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
