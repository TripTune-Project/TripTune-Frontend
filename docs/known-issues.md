# Known Issues — 블로그 개고 중 발견한 버그 (2026-07-29)

블로그 글을 쓰려고 코드를 다시 읽다가 발견한 미수정 버그 4건. 각 항목은 관련 블로그 글에 "후속 과제"로 명시돼 있으며, 수정 시 전후 비교 글감이 된다.

## 1. 삭제 드롭존 isOver가 이탈 시 리셋되지 않음

- **파일**: `src/components/Feature/Schedule/ScheduleRoute.tsx` — `DeleteDropZone`
- **증상**: 여행지를 휴지통 위까지 끌고 갔다가 다른 곳에 놓으면, 휴지통이 빨간 상태로 남는다.
- **원인**: `isOver`를 로컬 state로 관리하며 `hover`에서 `true`로 켜고, 끄는 곳이 `drop` 콜백뿐이다. 드롭 없이 이탈하면 리셋 경로가 없다.
- **수정 방향**: `collect: (monitor) => ({ isOver: monitor.isOver() })`로 이미 수집 중인 값을 구조 분해에서 버리지 말고(`const [{ isOver }, drop]`) 그대로 사용. 로컬 state와 `hover` 핸들러 제거. 모니터의 `isOver`는 이탈 시 자동으로 false가 된다.

## 2. 컴포넌트 내부에 컴포넌트 정의 — 렌더마다 리마운트

- **파일**: `src/components/Feature/Schedule/ScheduleRoute.tsx`
- **증상/위험**: `PlaceItem`, `DeleteDropZone`이 `ScheduleRoute` 함수 안에 정의돼 있어 렌더마다 컴포넌트 타입이 새로 생성됨 → React가 매번 언마운트→마운트. hover 정렬은 렌더를 연발하는 기능이라 최악의 조합. HTML5 드래그가 브라우저 레벨에서 유지되는 덕에 "어쩌다 동작" 중.
- **수정 방향**: 두 컴포넌트를 파일 최상위(또는 별도 파일)로 이동. 필요한 값은 props로 전달.

## 3. 빈 목록 안내의 invalid HTML 중첩 (`<p>` 안에 `<div>`/`<p>`)

- **파일**: `src/components/Feature/Schedule/ScheduleRoute.tsx` — 빈 루트 안내 JSX
- **증상/위험**: `<p className={styles.noResults}>` 안에 `<Image>`, `<div>`, `<p>`가 들어 있음. HTML 스펙상 `p`는 블록 요소를 담을 수 없어 브라우저가 태그를 임의로 쪼개며, Next.js hydration 불일치 경고의 원인이 됨.
- **수정 방향**: 바깥 `<p>`를 `<div>`로 교체.

## 4. logoutApi — 서버 요청 실패 시 쿠키가 안 지워짐

- **파일**: `src/apis/Login/logoutApi.ts`
- **증상**: 서버가 죽어 있거나 네트워크가 끊긴 상태에서 로그아웃하면, `await patch(...)`가 throw되어 `Cookies.remove` 줄에 도달하지 못한다 → 자격증명이 브라우저에 잔류.
- **수정 방향**: 쿠키 정리를 `try { await patch(...) } finally { Cookies.remove('accessToken'); Cookies.remove('nickname'); }`로 이동. 사용자의 "이 기기에서 세션 끝내기" 의도는 서버 실패와 무관하게 존중돼야 한다.

---