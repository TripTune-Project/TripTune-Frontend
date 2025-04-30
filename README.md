# TripTune (TripTune)

## 프로젝트 개요

**TripTune-Frontend**는 여러 사용자가 함께 여행 계획을 세울 수 있도록 지원하는 웹 서비스의 프론트엔드입니다.  
Next.js 기반으로 개발되었으며, 여행 일정 작성, 장소 추천, 마이페이지, 소셜 로그인 등 다양한 기능을 제공합니다.

---

## 파일 구조

```
src/
  ├── apis/           # API 호출 관련 코드
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

설치 및 실행:
```bash
yarn install
yarn dev
```

---

## 프론트 기능 기술 요약

- **여행 일정 생성/수정/공유**
- **장소 추천 및 상세 정보 제공**
- **드래그 앤 드롭 기반 일정 편집**
- **마이페이지(내 정보, 내 일정, 회원 탈퇴 등)**
- **소셜 로그인/회원가입/비밀번호 찾기**
- **실시간 알림 및 모달 UI**
- **반응형 UI 및 접근성 고려**

---

## 주요 서비스 구현 가이드

- **Next.js 14 기반의 App Router 구조**
- **상태 관리는 zustand, react-query 사용**
- **MUI, styled-components, emotion 등으로 UI 구성**
- **Google Maps, Swiper 등 외부 라이브러리 활용**
- **코드 포맷팅(Prettier), 린트(ESLint) 적용**
- **API 연동 및 비동기 데이터 처리**

---

## 환경 변수(.env) 설정 안내

Google Maps, GA4 등 외부 서비스 연동에 환경 변수가 필요합니다.

예시:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=발급받은_구글_맵_API_키
NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID=구글_맵_스타일_ID
NEXT_PUBLIC_GA4_MEASUREMENT_ID=구글_애널리틱스_측정_ID
```
`.env.local` 파일에 위와 같이 작성하세요.

---

## 배포 방법

Netlify, Vercel 등으로 배포 시 빌드 명령어:
```bash
yarn build
yarn start
```
환경 변수도 배포 환경에 맞게 설정 필요합니다.

---

## 주요 기술 스택

- Next.js 14
- React 18
- TypeScript
- Zustand, React Query
- MUI, styled-components, emotion
- Google Maps, Swiper 등

---

## 라이선스 / 기여 / 문의

- **라이선스**: (예: MIT, 필요시 명시)
- **기여 방법**: PR, 이슈 등록 등 오픈소스라면 안내
- **문의**: 이메일, 깃허브 이슈 등

---

## 버전 정보 / 변경 이력(Changelog)

- 최초 릴리즈: 0.1.0

---
