describe('인증 기능 E2E 테스트', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('로그인 페이지가 정상적으로 로드된다', () => {
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

  it('유효하지 않은 이메일로 로그인 시도 시 에러 메시지가 표시된다', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('유효한 이메일 주소를 입력해주세요.').should('be.visible');
  });

  it('유효하지 않은 비밀번호로 로그인 시도 시 에러 메시지가 표시된다', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('비밀번호는 8자 이상이어야 합니다.').should('be.visible');
  });

  it('유효한 정보로 로그인 시도 시 로그인이 성공한다', () => {
    cy.get('[data-testid="email-input"]').type(Cypress.env('testUser').email);
    cy.get('[data-testid="password-input"]').type(Cypress.env('testUser').password);
    cy.get('[data-testid="login-button"]').click();

    // 로그인 성공 후 홈페이지로 리다이렉트
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('소셜 로그인 버튼이 정상적으로 동작한다', () => {
    cy.get('[data-testid="google-login-button"]').click();
    
    // Google OAuth 팝업이 열리는지 확인
    cy.window().then((win) => {
      cy.stub(win, 'open').as('openStub');
    });
    
    cy.get('@openStub').should('have.been.called');
  });

  it('회원가입 페이지로 이동할 수 있다', () => {
    cy.contains('회원가입').click();
    cy.url().should('include', '/join');
  });

  it('비밀번호 찾기 페이지로 이동할 수 있다', () => {
    cy.contains('비밀번호 찾기').click();
    cy.url().should('include', '/find-password');
  });
}); 