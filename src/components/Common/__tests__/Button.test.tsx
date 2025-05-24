import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button 컴포넌트', () => {
  it('기본 렌더링이 정상적으로 동작한다', () => {
    render(<Button>테스트 버튼</Button>);
    expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
  });

  it('disabled 상태가 정상적으로 동작한다', () => {
    render(<Button disabled>비활성화 버튼</Button>);
    expect(screen.getByText('비활성화 버튼')).toBeDisabled();
  });

  it('onClick 이벤트가 정상적으로 동작한다', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>클릭 버튼</Button>);
    fireEvent.click(screen.getByText('클릭 버튼'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('variant에 따라 스타일이 변경된다', () => {
    const { rerender } = render(<Button variant="primary">Primary 버튼</Button>);
    expect(screen.getByText('Primary 버튼')).toHaveClass('primary');

    rerender(<Button variant="secondary">Secondary 버튼</Button>);
    expect(screen.getByText('Secondary 버튼')).toHaveClass('secondary');
  });

  it('size에 따라 스타일이 변경된다', () => {
    const { rerender } = render(<Button size="small">Small 버튼</Button>);
    expect(screen.getByText('Small 버튼')).toHaveClass('small');

    rerender(<Button size="large">Large 버튼</Button>);
    expect(screen.getByText('Large 버튼')).toHaveClass('large');
  });
}); 