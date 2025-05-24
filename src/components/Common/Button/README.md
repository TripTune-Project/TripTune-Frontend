# Button 컴포넌트

재사용 가능한 버튼 컴포넌트입니다.

## 사용 방법

```tsx
import Button from '@/components/Common/Button';

// 기본 사용
<Button>기본 버튼</Button>

// variant 사용
<Button variant="primary">Primary 버튼</Button>
<Button variant="secondary">Secondary 버튼</Button>
<Button variant="text">Text 버튼</Button>

// size 사용
<Button size="small">Small 버튼</Button>
<Button size="medium">Medium 버튼</Button>
<Button size="large">Large 버튼</Button>

// disabled 상태
<Button disabled>비활성화 버튼</Button>

// onClick 이벤트
<Button onClick={() => console.log('clicked')}>클릭 버튼</Button>
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'text' | 'primary' | 버튼의 스타일 변형 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 버튼의 크기 |
| disabled | boolean | false | 버튼 비활성화 여부 |
| onClick | () => void | - | 클릭 이벤트 핸들러 |
| type | 'button' \| 'submit' \| 'reset' | 'button' | 버튼의 타입 |
| className | string | '' | 추가 클래스명 |
| aria-label | string | - | 접근성을 위한 레이블 |

## 스타일

버튼은 CSS 모듈을 사용하여 스타일링됩니다. 주요 스타일 변수:

- 색상: `--color-primary`, `--color-secondary`
- 폰트: `--font-family`, `--font-size-*`
- 간격: `--spacing-*`
- 테두리: `--radius-*`
- 전환: `--transition-*`

## 접근성

- 키보드 네비게이션 지원
- ARIA 속성 지원
- 포커스 스타일 적용

## 성능

- React.memo를 사용한 메모이제이션
- useCallback을 사용한 이벤트 핸들러 최적화 