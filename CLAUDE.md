# CLAUDE.md

여행 일정 계획 서비스 **TripTune**의 프론트엔드. AI 에이전트가 이 저장소에서 작업할 때 참고하는 가이드.

## 기술 스택

- **프레임워크**: Next.js 14 (App Router), React 18
- **언어**: TypeScript (strict)
- **상태 관리**: Zustand(전역) + React Query / TanStack Query(서버 상태·캐싱)
- **스타일링**: CSS Modules(`src/styles/*.module.css`)가 주력, 일부 MUI 7 / styled-components / emotion 병행
- **지도**: Google Maps (`@react-google-maps/api`)
- **실시간**: WebSocket (STOMP over SockJS) — 공동 편집·채팅·알림
- **폼**: React Hook Form
- **테스트**: Jest + React Testing Library(통합), Cypress(E2E), MSW(모의 서버)
- **패키지 매니저**: yarn

## 명령어

```bash
yarn local        # 개발 서버 (포트 5814) ← 로컬 작업 시 기본
yarn dev          # 개발 서버 (기본 포트 3000)
yarn build        # 프로덕션 빌드
yarn typecheck    # tsc --noEmit 타입 검사
yarn lint         # next lint (ESLint)
yarn format       # prettier --write .
yarn test         # Jest 통합 테스트
yarn test:e2e     # Cypress E2E
```

변경 후에는 최소한 `yarn typecheck`로 검증할 것. 기존 테스트 파일(`Travel.integration.test.tsx` 등)에는 이 작업과 무관한 선행 타입 에러가 있으니, 내가 건드린 파일에 한정해 확인한다.

## 디렉터리 구조

```
src/
  apis/        # 도메인별 API 호출 (BookMark, Home, Join, Login, MyPage, Schedule, Travel, Verify) + api.ts(공통 설정)
  app/         # App Router 라우트. Travel / Schedule / MyPage / Join / Login / Find + layout.tsx, header.tsx
  components/
    Common/    # 공통 컴포넌트 (NoResult, DataLoading, Pagination, 모달 등)
    Feature/   # 도메인 기능 컴포넌트 (Travel/, Schedule/ 등)
  hooks/       # useAuth, useTravel, useSchedule, useMyPage, useDebounce, useGeolocation
  store/       # Zustand: travelStore, scheduleStore, myPageBookMarkStore
  styles/      # CSS Modules
  types/       # 타입 정의
  utils/       # 유틸 (truncateText 등)
  mocks/       # MSW 핸들러
```

## 코드 규칙

- **신규 의존성 추가 지양** — 이미 설치된 라이브러리나 몇 줄 코드로 해결할 수 있으면 그렇게 한다.
- **dynamic import 지양** — 과거 Netlify 빌드 실패 이력이 있음. 다른 방법을 먼저 고려한다.
- 스타일은 해당 페이지의 CSS Module을 우선 사용. 컴포넌트 내 인라인 스타일은 기존 패턴을 따를 때만.
- 함수형 컴포넌트 + 명시적 타입. Prettier 설정(세미콜론 O, 작은따옴표, JSX 작은따옴표, printWidth 80, tab 2)을 따른다.
- 버그 수정은 증상이 아니라 근본 원인을 고친다. 공유 컴포넌트(`NoResult`, `DataLoading` 등)를 수정할 때는 **모든 호출부**(Travel / Schedule / MyPage)를 확인하고 회귀가 없는지 본다.

## 환경 변수 (`.env.local`)

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_BROKER_URL=        # WebSocket 브로커
NEXT_PUBLIC_API_URL=           # 백엔드 API
```

## Git

- 브랜치: `master`(배포), `develop`(개발), 작업 브랜치(예: `hjlim/...`, `feature/...`).
- 커밋·푸시는 **명시적으로 요청받았을 때만** 한다.
- 커밋 메시지에 `Co-Authored-By` trailer를 **붙이지 않는다**.
