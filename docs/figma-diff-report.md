# Figma vs 코드 차이점 리포트

> Figma 파일: `RVxoaaR7OyuiOQ068yh6Yz` (TripTune Original - 복사본)
> 비교한 frame 수: **44개**
> 작성일: 2026-05-10

## 📊 요약

| 분류 | 개수 | 비고 |
|---|---:|---|
| OFF-LIMITS (이미 의도적 조정됨, 건드리지 말 것) | 21 | 최근 commit으로 손댄 영역 |
| 단일 도형 / 의미 없음 | 1 | `208:222` (단일 Rectangle) |
| **REVIEW (실제 비교 대상)** | **22** | |

---

## 🔴 HIGH 우선순위 — 명백한 시각적 결함

### 1. /MyPage 북마크 카드 라운드가 비대칭
- **파일**: `src/styles/Mypage.module.css` `.bookmarkCard`
- **현재**: `border-radius: 10px 0 10px 0` (좌상/우하만 라운드)
- **Figma**: 4면 모두 10px 라운드
- **수정안**: `border-radius: 10px;`

### 2. /MyPage 북마크 썸네일 우상단 라운드 누락
- **파일**: `src/styles/Mypage.module.css` `.thumbnailImage`, `.imageContainer`, `.noImage`
- **현재**: `border-top-left-radius: 9px` 만 적용
- **Figma**: 카드 상단 이미지의 좌·우 코너 모두 라운드
- **수정안**: `border-radius: 9px 9px 0 0;`

### 3. /Schedule 공유 모달 라운드가 비대칭
- **파일**: `src/components/Feature/Schedule/InviteModal.tsx` `ModalContainer` (styled-component)
- **현재**: `border-radius: 30px 0` (좌상단만 30px, 우상/좌하/우하 0)
- **Figma**: 4코너 균일 라운드 (약 12~16px 추정)
- **수정안**: `border-radius: 16px;` (또는 디자인 토큰 확인 후 결정)

### 4. /Schedule 공유 모달 화면 정렬 깨짐
- **파일**: `src/components/Feature/Schedule/InviteModal.tsx` `ModalContainer`
- **현재**: `margin-bottom: 200px` 강제 위쪽 치우침
- **Figma**: 화면 정중앙 정렬
- **수정안**: `margin-bottom` 제거, overlay에서 `align-items: center; justify-content: center`로 처리

---

## 🟡 MEDIUM 우선순위

### 5. /MyPage 북마크 정렬 select가 native
- **파일**: `src/components/Feature/MyPage/BookMark.tsx` (lines 83-91)
- **현재**: `<select>` 기본 스타일 (OS/브라우저별 렌더링 다름)
- **Figma**: 커스텀 dropdown (둥근 모서리, 옵션 행 호버)
- **수정안**: 커스텀 dropdown 컴포넌트 도입 또는 `<select>` 스타일 강제

### 6. /MyPage 북마크 카드 width 고정
- **파일**: `src/styles/Mypage.module.css` `.bookmarkCard`
- **현재**: `width: 228px` 고정
- **Figma**: 컨테이너 가용폭에 맞춰 자연스럽게 분할
- **수정안**: `width: 100%` + grid가 4컬럼에서 자동 계산되게

### 7. /MyPage 북마크 폰트 크기
- **파일**: `src/styles/Mypage.module.css` `.placeName`, `.placeDetailAddress`
- **현재**: placeName 12px / address 10px
- **Figma**: 14px / 12px
- **수정안**: 폰트 크기 +2px씩

### 8. /Travel 일정담기 모달 Divider 폭
- **파일**: `src/components/Feature/Travel/MyScheduleEditModal.tsx`
- **현재**: Divider가 padding 37px 안쪽에 그려짐
- **Figma**: 헤더 영역 폭(503px) 전체에 닿는 라인
- **수정안**: Divider를 padding 바깥(절대 위치 또는 별도 wrapper)로 이동

### 9. /Travel 일정담기 모달 체크박스 사이즈
- **파일**: `src/components/Feature/Travel/MyScheduleEditModal.tsx`
- **현재**: StyledCheckbox 24×24
- **Figma**: 22×22
- **수정안**: 22×22로 축소

### 10. /Schedule 공유 모달 헤더 정렬 하드코딩
- **파일**: `src/components/Feature/Schedule/InviteModal.tsx` `Header`, `CloseButton`
- **현재**: `margin-left: 37px`, `margin-left: 75%` 하드코딩
- **Figma**: padding 균등한 flex `space-between` 레이아웃
- **수정안**: `display: flex; justify-content: space-between; padding: 24px;`

### 11. /Schedule 공유 모달 DropdownMenu 고정 height
- **파일**: `src/components/Feature/Schedule/InviteModal.tsx` `DropdownMenu`
- **현재**: `height: 199px` 고정
- **Figma**: 콘텐츠 높이로 타이트하게 (항목 수 따라 가변)
- **수정안**: `height: auto;` (max-height만 제한)

### 12. /Schedule 공유 모달 AuthorLabel 배경 강도
- **파일**: `src/components/Feature/Schedule/InviteModal.tsx` `AuthorLabel`
- **현재**: `background: #f3f8f8` (눈에 띄는 박스)
- **Figma**: "작성자" 텍스트만 표시, 배경 거의 투명
- **수정안**: 배경 제거 또는 더 옅은 톤

### 13. /Schedule 공유 모달 "일정나가기" 띄어쓰기
- **파일**: `src/components/Feature/Schedule/InviteModal.tsx`
- **현재**: `일정나가기`
- **Figma**: `일정 나가기`
- **수정안**: 텍스트 변경

---

## 🟢 LOW 우선순위 — 무시 가능 / 사전 확인 필요

### 무시 가능
| 항목 | 비고 |
|---|---|
| /MyPage 북마크 "전체 N" 배지 색상 #74A5DA | Figma는 청록 톤이지만 미세 |
| /MyPage 북마크 "오래된 순" 띄어쓰기 | "오래된순"으로 통일하면 좋으나 미세 |
| /MyPage LogoutModal 취소 버튼 border `#ccc`, 텍스트 색 `#333` | 매우 미세 |
| /Travel 일정담기 모달 `marginTop: -10px` hack | 시각 결과는 문제 없음, 코드 청결도만 이슈 |
| /Travel 일정담기 모달 `font-weight: 505` (비표준) | 브라우저는 500으로 round |
| /Schedule 삭제 모달 버튼 width 153px (Figma는 더 좁음) | 기능적 문제 없음 |
| /Schedule 공유 모달 DropdownItem `margin-left: 9px` | 비대칭 inset |
| /Schedule 공유 모달 CloseButton 텍스트 `'✕'` (Figma는 SVG 아이콘) | 시각 차이 미미 |

### ⚠️ 사전 확인 필요 (3d2ad61 범주)
- **/MyPage LoginModal (`src/components/Common/LoginModal.tsx`)**
  - height 252px → Figma는 230px 정도로 컴팩트
  - `<ModalOverlay style={{ marginTop: '-93px' }}>` 헤더 보정 hack
  - `font-weight: 505` 비표준값
  - `font-family: 'NOto Sans KR'` 오타 (대문자 O)
  - **이유**: commit 3d2ad61 "로그인/회원가입/비밀번호찾기/마이페이지 Figma 기준 복원" 범주에 들어가므로 변경 전 해당 commit 의도 재확인 권장

---

## ⛔ OFF-LIMITS — 건드리지 말 것 (이미 의도적 조정됨)

| 영역 | commit | Figma frame |
|---|---|---|
| /Login, /Join, /Find/ChangePassword | 3d2ad61 | 152:91, 153:199, 153:318, 268:501 |
| /Travel/[placeId] 상세 (지도/레이아웃) | 6c5a266 | 171:99, 185:93, 171:119, 186:509, 187:1174, 333:90, 333:292 |
| /Travel 리스트 카드 썸네일/주소 | a50f117 | 130:611, 130:745 (해당 부분만) |
| /Schedule/[scheduleId] 여행지 검색 탭, 채팅, 캘린더 | def714b | 1:17372, 133:115, 133:370, 133:1310, 133:1750, 284:90 (캘린더) |
| /MyPage 계정 관리 (이메일/비밀번호 변경) | 3d2ad61 | 133:6530, 133:6616, 133:6716 |
| /MyPage 회원 탈퇴 모달 | fa50ca3 | 133:6825 |
| /MyPage 프로필 관리 | d2cc6bb | 268:424, 267:367 |
| 채팅 시간 포맷, 추천 슬라이더 | 45e8748 | (Schedule 공유 일정/홈 추천 영역) |
| 일정 편집 모달 오버레이 | b2e7457 | (편집 모달 일부) |
| 홈 추천 슬라이더 화살표/여백 | 5d44634 | (홈 화면) |
| Snackbar 알림 | 88b63ac | (전역) |
| 그룹 채팅 입력창/시간 포맷 | 750f34c | (Schedule 채팅 영역) |

---

## 🎯 권장 적용 순서

1. **HIGH 4개 먼저** — 명백한 시각 결함, 수정 비용 적음
2. **MEDIUM** — 시각적 일관성 개선, 수정 영향이 좁은 것부터 (5, 9, 13 → 6, 7, 8 → 10, 11, 12)
3. **LOW의 ⚠️ 사전 확인 필요** 항목 — 3d2ad61 commit 영향 분석 후 판단
4. 나머지 LOW는 다음 디자인 리뷰 사이클에 모아서 처리
