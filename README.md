# TripTune (여행 일정 계획 서비스)

## 프로젝트 개요

**TripTune-Frontend**는 여러 사용자가 함께 여행 계획을 세울 수 있도록 지원하는 웹 서비스의 프론트엔드입니다.  
Next.js 기반으로 개발되었으며, 여행 일정 작성, 장소 추천, 마이페이지, 소셜 로그인 등 다양한 기능을 제공합니다.

### 주요 기능

- 실시간 공동 여행 일정 작성 및 관리
- 여행지 검색 및 추천
- 채팅을 통한 여행 계획 논의
- 일정 공유 및 초대
- 사용자 인증 및 계정 관리

---

## 파일 구조

```
src/
  ├── apis/           # API 호출 관련 코드
  │   ├── BookMark/   # 북마크 관련 API
  │   ├── Home/       # 홈 화면 관련 API
  │   ├── Login/      # 인증 관련 API
  │   ├── MyPage/     # 마이페이지 관련 API
  │   ├── Schedule/   # 일정 관련 API
  │   └── Travel/     # 여행 정보 관련 API
  ├── app/            # Next.js 라우팅 및 페이지
  │   ├── Travel/     # 여행지 상세/추천 페이지
  │   ├── Schedule/   # 여행 일정 관리 페이지
  │   ├── MyPage/     # 마이페이지
  │   ├── Join/       # 회원가입
  │   ├── Login/      # 로그인
  │   └── Find/       # 계정 찾기/비밀번호 변경
  ├── components/
  │   ├── Feature/    # 주요 기능별 컴포넌트
  │   └── Common/     # 공통 컴포넌트 (모달, 로딩 등)
  ├── hooks/          # 커스텀 훅
  ├── store/          # 상태 관리(zustand)
  ├── styles/         # 스타일 파일
  ├── types/          # 타입 정의
  └── utils/          # 유틸 함수
```

---

## 사전 요구사항 (최소)

- Node.js 18 이상
- yarn

## 설치 및 실행:

```bash
# 패키지 설치
yarn install

# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

---

## 프론트 기능 기술 요약

- **여행 일정 생성/수정/공유**

  - 드래그 앤 드롭 기반 일정 편집
  - 지도 기반 여행지 선택 및 루트 계획
  - 공동 일정 편집 및 실시간 채팅

- **장소 추천 및 상세 정보 제공**

  - 지역별 인기 여행지 정보
  - 유형별 장소 검색 및 필터링
  - 북마크 기능

- **마이페이지(내 정보, 내 일정, 회원 탈퇴 등)**

  - 프로필 관리
  - 작성한 일정 및 공유받은 일정 관리
  - 북마크한 장소 관리

- **소셜 로그인/회원가입/비밀번호 찾기**

  - 이메일 인증
  - OAuth 연동 (구글, 네이버, 카카오)

- **실시간 알림 및 모달 UI**

  - WebSocket 기반 실시간 알림
  - 사용자 친화적인 모달 인터페이스

- **반응형 UI 및 접근성 고려**
  - 다양한 디바이스 대응
  - 웹 접근성 고려

---

## 주요 서비스 구현 가이드

- **Next.js 14 기반의 App Router 구조**

  - 페이지 라우팅
  - 서버 컴포넌트 및 클라이언트 컴포넌트 구분

- **상태 관리는 zustand, react-query 사용**

  - 전역 상태 관리 (zustand)
  - 서버 상태 및 캐싱 (react-query)

- **MUI, styled-components, emotion 등으로 UI 구성**

  - 공통 컴포넌트
  - 테마 관리

- **Google Maps, Swiper 등 외부 라이브러리 활용**

  - 지도 기반 기능
  - 슬라이더 및 캐러셀

- **코드 포맷팅(Prettier), 린트(ESLint) 적용**

  - 일관된 코드 스타일
  - 코드 품질 관리

- **API 연동 및 비동기 데이터 처리**
  - 에러 핸들링
  - 로딩 상태 관리

---

## 환경 변수(.env) 설정 안내

Google Maps, GA4, WebSocket 등 외부 서비스 연동에 환경 변수가 필요합니다.

예시:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=발급받은_구글_맵_API_키
NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID=구글_맵_스타일_ID
NEXT_PUBLIC_GA4_MEASUREMENT_ID=구글_애널리틱스_측정_ID
NEXT_PUBLIC_BROKER_URL=웹소켓_브로커_URL
NEXT_PUBLIC_API_URL=백엔드_API_URL
```

`.env.local` 파일에 위와 같이 작성하세요.

---

## 배포 방법

Netlify, Vercel 등으로 배포 시:

1. 레포지토리 연결
2. 빌드 설정
   ```bash
   # 빌드 명령어
   yarn build
   ```
3. 환경 변수 설정
   - 배포 환경에 맞게 환경 변수를 설정
4. 도메인 설정 및 SSL 인증서 적용

---

## 주요 기술 스택

- **프레임워크**: Next.js 14, React 18
- **언어**: TypeScript
- **상태 관리**: Zustand, React Query (TanStack Query)
- **스타일링**: MUI, styled-components, emotion
- **지도 서비스**: Google Maps
- **차트 및 시각화**: Chart.js
- **폼 관리**: React Hook Form, Yup
- **테스팅**: Jest, React Testing Library
- **실시간 통신**: WebSocket (STOMP)

---

## 개발 가이드라인

- **코드 작성 규칙**

  - 타입을 명확히 작성
  - 함수형 컴포넌트 사용
  - 관심사 분리 준수
  - 재사용 가능한 컴포넌트 설계

- **주석 작성 가이드**

  - 컴포넌트, 함수 목적 설명
  - 매개변수 및 반환 값 설명
  - 복잡한 로직에 대한 설명 추가

- **브랜치 전략**
  - main: 배포 브랜치
  - develop: 개발 브랜치
  - feature/[기능명]: 기능 개발 브랜치

---

## 프로젝트 문의 및 정보

- **이메일**: triptunehost@gmail.com
- **GitHub**: https://github.com/TripTune-Project
- **웹사이트**: https://www.triptune.site

---

## 버전 정보 / 변경 이력(Changelog)

- v1.0.0 (2024-04) - 최초 릴리즈
  - 일정 관리 기능
  - 여행지 검색 및 추천
  - 사용자 인증 및 계정 관리
  - 실시간 채팅

---

## 라이선스

- MIT License

---
