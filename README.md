# TripTune (여행 일정 계획 서비스)

여러 사용자가 함께 여행 계획을 세우는 웹 서비스의 프론트엔드.
Next.js App Router 기반으로 여행지 검색·일정 편집·실시간 채팅·마이페이지를 제공합니다.

- 웹사이트: https://www.triptune.co.kr
- GitHub: https://github.com/TripTune-Project
- 문의: triptunehost@gmail.com

---

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router), React 18 |
| 언어 | TypeScript (strict) |
| 상태 관리 | Zustand 4 (전역), TanStack Query 5 (서버 상태·캐싱) |
| 스타일 | CSS Modules 주력, MUI 7 · styled-components · emotion 병행 |
| 지도 | Google Maps (`@react-google-maps/api`) |
| 실시간 | STOMP over SockJS (`@stomp/stompjs`) — 채팅 |
| 드래그 앤 드롭 | `react-dnd` + HTML5 backend |
| 폼 | React Hook Form |
| 테스트 | Jest + React Testing Library, MSW / Cypress (E2E) |
| 패키지 매니저 | yarn |

---

## 실행

사전 요구사항: Node.js 18.18 이상, yarn.

```bash
yarn install

yarn local        # 개발 서버, 포트 5814 (로컬 작업 기본)
yarn dev          # 개발 서버, 포트 3000

yarn typecheck    # tsc --noEmit
yarn lint         # next lint
yarn format       # prettier --write .

yarn build && yarn start   # 프로덕션 빌드·실행
```

변경 후에는 최소한 `yarn typecheck`로 검증합니다.

### 환경 변수

`.env.local`(또는 `.env`)에 아래 키를 채웁니다. 모두 코드에서 실제로 참조됩니다.

```
NEXT_PUBLIC_API_URL=            # 백엔드 API (next.config.mjs의 /apis/* 프록시 대상)
NEXT_PUBLIC_BROKER_URL=         # WebSocket 브로커 (채팅)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
```

`/apis/:path*` 요청은 `next.config.mjs`의 rewrite로 `${NEXT_PUBLIC_API_URL}/api/:path*`에 프록시됩니다.
이미지 원본은 `triptune.s3.ap-northeast-2.amazonaws.com`만 `next/image`에 허용되어 있습니다.

---

## 파일 구조

```
next.config.mjs      # SVGR, 이미지/캐시 헤더, /apis 프록시
src/
  apis/              # 도메인별 API 호출
    BookMark/ Home/ Join/ Login/ MyPage/ Schedule/ Travel/ Verify/
    api.ts           # 공통 설정
  app/               # App Router
    Travel/[placeId] Schedule/[scheduleId] MyPage/ Join/ Login/ Find/
    layout.tsx header.tsx page.tsx 404.tsx 500.tsx
  components/
    Common/          # NoResult, DataLoading, Pagination, 각종 모달 등
    Feature/         # Home / Travel / Schedule / MyPage / Login / Join
  hooks/             # useAuth, useTravel, useSchedule, useMyPage, useDebounce, useGeolocation
  store/             # travelStore, scheduleStore, myPageBookMarkStore (zustand)
  styles/            # CSS Modules
  types/             # 타입 정의
  utils/             # 유틸
  mocks/server.ts    # MSW 서버·핸들러 (Jest용)
cypress/             # E2E 스펙 및 설정
docs/                # known-issues.md, figma-diff-report.md
```

---

## 주요 기능

- **여행 일정** — 생성/수정/공유, 드래그 앤 드롭 일정 편집, 지도 기반 루트 구성
- **여행지** — 지역·유형별 검색과 추천, 상세 정보, 북마크
- **협업** — 일정 공유·초대, STOMP 기반 실시간 채팅
- **마이페이지** — 프로필, 내 일정·공유받은 일정, 북마크 관리, 회원 탈퇴
- **계정** — 이메일 인증 회원가입, 비밀번호 찾기·변경, 카카오·네이버 소셜 로그인

---

## 테스트

```bash
yarn test            # Jest 통합 테스트
yarn test:watch
yarn test:coverage   # 커버리지 (jest.config.js 임계치 80%)
yarn cy:open         # Cypress UI
yarn cy:run          # Cypress 헤드리스
```

- Jest: `ts-jest` + `jest-fixed-jsdom`, 대상은 `src/**/__tests__/**` 와 `src/**/*.{spec,test}.{ts,tsx}`.
  현재 작성된 테스트는 `src/components/Common/__tests__/Button.test.tsx` 한 건이라 커버리지 임계치 80%는 아직 목표값입니다.
- Cypress: `baseUrl`은 `http://localhost:5814`이므로 `yarn local`로 서버를 띄운 뒤 실행합니다.
  스펙은 `cypress/e2e/**/*.cy.ts`(현재 `home.cy.ts`), 테스트 계정·데이터는 `cypress.env.json`에 둡니다.
  실행 시 비디오는 `cypress/videos/`, 실패 스크린샷은 `cypress/screenshots/`에 저장됩니다.
- MSW: `src/mocks/server.ts`의 핸들러가 `NEXT_PUBLIC_API_URL` 기준으로 동작하므로 환경 변수가 필요합니다.

---

## 코드 규칙

- 신규 의존성 추가 지양 — 이미 설치된 라이브러리나 몇 줄 코드로 해결되면 그렇게 합니다.
- `dynamic import` 지양 — 과거 Netlify 빌드 실패 이력이 있습니다.
- 스타일은 해당 페이지의 CSS Module 우선. 인라인 스타일은 기존 패턴을 따를 때만.
- 함수형 컴포넌트 + 명시적 타입. Prettier 설정(세미콜론 O, 작은따옴표, JSX 작은따옴표, printWidth 80, tab 2)을 따릅니다.
- 버그는 증상이 아니라 근본 원인을 고칩니다. 공유 컴포넌트(`NoResult`, `DataLoading` 등) 수정 시 Travel / Schedule / MyPage 호출부를 모두 확인합니다.

---

## Git

- 브랜치: `master`(배포), `develop`(개발), 작업 브랜치(`hjlim/...`, `feature/...`).
- 커밋 메시지에 `Co-Authored-By` trailer를 붙이지 않습니다.

## 배포

Netlify(`@netlify/plugin-nextjs`) 기준. 레포지토리 연결 → 빌드 명령 `yarn build` → 환경 변수 설정 → 도메인·SSL 적용.

## 미해결 이슈

`docs/known-issues.md`에 코드 리딩 중 발견된 미수정 버그가 정리되어 있습니다.
