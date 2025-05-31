import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { AuthProvider } from '@/store/AuthContext';

describe('Login 컴포넌트 통합 테스트', () => {
  const renderLogin = () => {
    return render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  };

  it('로그인 폼이 정상적으로 렌더링된다', () => {
    renderLogin();
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('유효하지 않은 이메일로 로그인 시도 시 에러 메시지가 표시된다', async () => {
    renderLogin();
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    expect(screen.getByText('유효한 이메일 주소를 입력해주세요.')).toBeInTheDocument();
  });

  it('유효하지 않은 비밀번호로 로그인 시도 시 에러 메시지가 표시된다', async () => {
    renderLogin();
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, '123');
    await userEvent.click(loginButton);

    expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument();
  });

  it('유효한 정보로 로그인 시도 시 로그인이 성공한다', async () => {
    renderLogin();
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('소셜 로그인 버튼이 정상적으로 동작한다', async () => {
    renderLogin();
    
    const googleLoginButton = screen.getByTestId('google-login-button');
    await userEvent.click(googleLoginButton);

    // Google OAuth 팝업이 열리는지 확인
    expect(window.open).toHaveBeenCalled();
  });
}); 