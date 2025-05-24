# 스타일 가이드

## 디자인 시스템

### 색상

```css
:root {
  --color-primary: #0066FF;
  --color-primary-hover: #0052CC;
  --color-secondary: #F5F5F5;
  --color-secondary-hover: #E5E5E5;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #666666;
  --color-text-disabled: #999999;
  --color-background: #FFFFFF;
  --color-border: #E5E5E5;
  --color-error: #FF3B30;
  --color-success: #34C759;
  --color-warning: #FF9500;
}
```

### 타이포그래피

```css
:root {
  --font-family: 'Noto Sans KR', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

### 간격

```css
:root {
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
}
```

### 테두리 반경

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### 그림자

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

### 전환

```css
:root {
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
}
```

### 반응형 브레이크포인트

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## 컴포넌트 스타일 가이드

### 버튼

- 기본 높이: 40px
- 패딩: 좌우 16px
- 폰트 크기: 16px
- 폰트 두께: 500
- 테두리 반경: 8px
- 전환: 300ms ease

### 입력 필드

- 기본 높이: 40px
- 패딩: 좌우 12px
- 폰트 크기: 16px
- 테두리: 1px solid var(--color-border)
- 테두리 반경: 8px
- 포커스: 2px solid var(--color-primary)

### 카드

- 패딩: 16px
- 테두리 반경: 12px
- 그림자: var(--shadow-md)
- 배경색: var(--color-background)

## 접근성 가이드라인

### 색상 대비

- 텍스트와 배경의 대비율: 최소 4.5:1
- 큰 텍스트(18pt 이상): 최소 3:1
- UI 요소와 배경: 최소 3:1

### 포커스

- 모든 상호작용 요소는 키보드로 접근 가능
- 포커스 표시기: 2px solid var(--color-primary)
- 포커스 순서: 논리적 순서 유지

### ARIA

- 적절한 ARIA 레이블 사용
- 상태 변경 시 ARIA 속성 업데이트
- 역할(role) 속성 올바르게 사용

## 반응형 디자인

### 모바일 우선 접근

- 기본 스타일은 모바일용으로 작성
- 미디어 쿼리로 데스크톱 스타일 확장
- 유동적 그리드 시스템 사용

### 이미지

- 반응형 이미지 사용
- 적절한 크기와 해상도 제공
- 지연 로딩 적용

### 타이포그래피

- 모바일: 14px ~ 16px
- 태블릿: 16px ~ 18px
- 데스크톱: 16px ~ 20px 