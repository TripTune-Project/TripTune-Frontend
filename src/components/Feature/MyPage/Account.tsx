import React, { useState } from 'react';
import styles from '@/styles/Mypage.module.css';

const Account = () => {
  const [userData] = useState({
    email:'',
  });
  
  return (
    <div className={styles.accountTabContent}>
      <h3>계정 관리</h3>
      <div className={styles.accountSection}>
        <div className={styles.fieldGroup}>
          <label><strong>이메일</strong></label>
          <input type="email" defaultValue={userData?.email} disabled />
          <button>인증 요청</button>
          <input type="text" placeholder="인증 코드 입력" />
          <button>인증 확인</button>
        </div>
        <div className={styles.fieldGroup}>
          <label><strong>비밀번호</strong></label>
          <input type="password" placeholder="현재 비밀번호" />
          <input
            type="password"
            placeholder="새 비밀번호(영문 대/소문자, 숫자, 특수문자 조합 8~15자리)"
          />
          <input type="password" placeholder="비밀번호 재입력" />
          <button>저장</button>
        </div>
      </div>
    </div>
  );
};

export default Account;
