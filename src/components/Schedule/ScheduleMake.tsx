import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';

const ScheduleMake = () => {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'scheduleTravel';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(
    initialTab as 'scheduleTravel' | 'travelRoot'
  );
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  
  useEffect(() => {
    setTab(initialTab as 'scheduleTravel' | 'travelRoot');
  }, [initialTab]);
  
  const handleTabChange = (tab: 'scheduleTravel' | 'travelRoot') => {
    setTab(tab);
    setMessage('');
    setErrorMessage('');
    setAlertOpen(false);
  };
  
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  const getFormattedDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : '';
  };
  
  return (
    <div className={styles.pageContainer}>
      <div>
          <h2 className={styles.detailTitle}>
            <Image src={triptuneIcon} alt="일정만들기" priority />
            일정 만들기
          </h2>
          <div className={styles.inputGroup}>
            <label>여행 이름</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="여행 이름을 입력해주세요."
            />
          </div>
          <div className={styles.inputGroup}>
            <label>여행 날짜</label>
            <input
              type="text"
              className={styles.inputField}
              value={`${getFormattedDate(startDate)} ~ ${getFormattedDate(endDate)}`}
              readOnly
            />
          </div>
        </div>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${tab === 'scheduleTravel' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('scheduleTravel')}
        >
          여행지
        </button>
        <button
          className={`${styles.tabButton} ${tab === 'travelRoot' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('travelRoot')}
        >
          여행 루트
        </button>
      </div>
      {tab === 'scheduleTravel' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="원하는 여행지를 검색하세요"
                style={{
                  width: '450px',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              />
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                돋보기
              </button>
            </div>
            {/* TODO : 반복 시점 10개씩 무한 스크롤 실행 */}
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
            </>
          </div>
      ) : (
        <div className={styles.inputGroup}>
          <div>
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>사진</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    훈련원공원
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    대한민국 / 서울 / 중구
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>
            서울특별시 중구 을지로 227 (을지로5가)
          </span>
                  </div>
                </div>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  추가
                </button>
              </div>
            </>
          </div>
        </div>
      )}
      {alertOpen && (
        <div
          className={`${styles.alert} ${alertSeverity === 'success' ? styles.alertSuccess : styles.alertError}`}
        >
          {alertSeverity === 'success' ? message : errorMessage}
        </div>
      )}
    </div>
  );
};

const WrappedScheduleMakePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ScheduleMake />
  </Suspense>
);

export default WrappedScheduleMakePage;
