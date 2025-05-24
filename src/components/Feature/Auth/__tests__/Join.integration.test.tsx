import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Join } from '../Join';
import { AuthProvider } from '@/store/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('회원가입 통합 테스트', () => {
  const renderJoin = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <Join />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('회원가입 폼이 정상적으로 렌더링된다', () => {
    renderJoin();
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-confirm-input')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('join-button')).toBeInTheDocument();
  });

  it('유효하지 않은 이메일 입력 시 에러 메시지가 표시된다', async () => {
    renderJoin();
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('유효한 이메일 주소를 입력해주세요.')).toBeInTheDocument();
    });
  });

  it('비밀번호 불일치 시 에러 메시지가 표시된다', async () => {
    renderJoin();
    
    const passwordInput = screen.getByTestId('password-input');
    const confirmInput = screen.getByTestId('password-confirm-input');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    fireEvent.blur(confirmInput);

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
    });
  });

  it('모든 필드가 유효할 때 회원가입이 성공한다', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ success: true });
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    renderJoin();
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('password-confirm-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: '홍길동' },
    });

    fireEvent.click(screen.getByTestId('join-button'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: '홍길동',
      });
    });
  });

  it('이미 존재하는 이메일로 회원가입 시도 시 에러 메시지가 표시된다', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: '이미 존재하는 이메일입니다.' }),
      } as Response)
    );

    renderJoin();
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('password-confirm-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: '홍길동' },
    });

    fireEvent.click(screen.getByTestId('join-button'));

    await waitFor(() => {
      expect(screen.getByText('이미 존재하는 이메일입니다.')).toBeInTheDocument();
    });
  });
}); 