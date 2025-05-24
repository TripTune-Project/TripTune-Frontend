import React, { Suspense } from 'react';
import { dynamicImport } from '@/utils/dynamicImport';
import Loading from '@/components/Common/Loading';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import styles from '@/styles/Travel.module.css';

// 동적 임포트로 컴포넌트 로드
const TravelList = dynamicImport(() => import('./TravelList'), {
  loading: () => <Loading text="목록 로딩 중..." />,
  ssr: false
});

const TravelMap = dynamicImport(() => import('./TravelMap'), {
  loading: () => <Loading text="지도 로딩 중..." />,
  ssr: false
});

const TravelFilter = dynamicImport(() => import('./TravelFilter'), {
  loading: () => <Loading text="필터 로딩 중..." />,
  ssr: false
});

const Travel: React.FC = () => {
  return (
    <div className={styles.travelContainer}>
      <ErrorBoundary>
        <Suspense fallback={<Loading text="필터 로딩 중..." />}>
          <TravelFilter />
        </Suspense>
      </ErrorBoundary>
      
      <div className={styles.travelContent}>
        <ErrorBoundary>
          <Suspense fallback={<Loading text="목록 로딩 중..." />}>
            <TravelList />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<Loading text="지도 로딩 중..." />}>
            <TravelMap />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Travel; 