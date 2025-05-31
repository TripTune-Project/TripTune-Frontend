describe('회원가입 E2E 테스트', () => {
  beforeEach(() => {
    cy.visit('/join');
  });

  it('회원가입 페이지가 정상적으로 로드된다', () => {
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="password-confirm-input"]').should('be.visible');
    cy.get('[data-testid="name-input"]').should('be.visible');
    cy.get('[data-testid="join-button"]').should('be.visible');
  });

  it('유효하지 않은 이메일 입력 시 에러 메시지가 표시된다', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="email-input"]').blur();
    cy.contains('유효한 이메일 주소를 입력해주세요.').should('be.visible');
  });

  it('비밀번호 불일치 시 에러 메시지가 표시된다', () => {
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="password-confirm-input"]').type('password456');
    cy.get('[data-testid="password-confirm-input"]').blur();
    cy.contains('비밀번호가 일치하지 않습니다.').should('be.visible');
  });

  it('모든 필드가 유효할 때 회원가입이 성공한다', () => {
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 200,
      body: { success: true }
    }).as('signupRequest');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="password-confirm-input"]').type('password123');
    cy.get('[data-testid="name-input"]').type('홍길동');
    cy.get('[data-testid="join-button"]').click();

    cy.wait('@signupRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      password: 'password123',
      name: '홍길동'
    });

    cy.url().should('include', '/login');
    cy.contains('회원가입이 완료되었습니다.').should('be.visible');
  });

  it('이미 존재하는 이메일로 회원가입 시도 시 에러 메시지가 표시된다', () => {
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 400,
      body: { message: '이미 존재하는 이메일입니다.' }
    }).as('signupRequest');

    cy.get('[data-testid="email-input"]').type('existing@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="password-confirm-input"]').type('password123');
    cy.get('[data-testid="name-input"]').type('홍길동');
    cy.get('[data-testid="join-button"]').click();

    cy.contains('이미 존재하는 이메일입니다.').should('be.visible');
  });

  it('소셜 로그인 버튼이 정상적으로 동작한다', () => {
    cy.get('[data-testid="google-login-button"]').should('be.visible');
    cy.get('[data-testid="google-login-button"]').click();
    cy.url().should('include', 'accounts.google.com');
  });

  it('로그인 페이지로 이동이 정상적으로 동작한다', () => {
    cy.get('[data-testid="login-link"]').click();
    cy.url().should('include', '/login');
  });
}); 