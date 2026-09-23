/**
 * QA 모음 > 로그인 / 회원가입 / 비밀번호 찾기 > 로그인 페이지 (로그인001 ~ 로그인010)
 * QA 모음 > 간편 로그인 (간편 로그인001)
 */
describe('로그인', () => {
  const EMAIL = 'input[placeholder="이메일"]';
  const PW = 'input[placeholder="비밀번호"]';
  const SUBMIT = 'button[type="submit"]';
  const user = () =>
    Cypress.env('testUser') as { email: string; password: string };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept('POST', '**/api/members/login').as('login');
    cy.visit('/Login');
  });

  it('로그인001 | 정상 계정으로 로그인하면 홈으로 이동하고 닉네임이 보인다', () => {
    cy.step('로그인001 · 유효한 이메일/비밀번호로 로그인');
    cy.get(EMAIL).type(user().email);
    cy.get(PW).type(user().password, { log: false });
    cy.get(SUBMIT).should('not.be.disabled').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.location('pathname', { timeout: 15000 }).should('eq', '/');
    cy.getCookie('accessToken').should('exist');
    cy.getCookie('nickname').should('exist');
    cy.get('header').contains('님').should('be.visible');
    cy.capture('로그인001-성공');
  });

  it('로그인002 | 잘못된 비밀번호는 오류 메시지를 보여준다', () => {
    cy.step('로그인002 · 잘못된 비밀번호로 로그인 시도');
    cy.get(EMAIL).type(user().email);
    cy.get(PW).type('Wrong1234!', { log: false });
    cy.get(SUBMIT).click();
    cy.wait('@login').its('response.statusCode').should('be.gte', 400);
    cy.get('.MuiAlert-message').should('be.visible');
    cy.capture('로그인002-실패메시지');
  });

  it('로그인003 | 입력값이 비어 있으면 로그인 버튼이 비활성이다', () => {
    cy.step('로그인003 · 빈 입력값 상태');
    cy.get(SUBMIT).should('be.disabled');
    cy.get(EMAIL).type(user().email);
    cy.get(SUBMIT).should('be.disabled');
    cy.capture('로그인003-버튼비활성');
  });

  it('로그인004 | "비밀번호 찾기"를 누르면 찾기 페이지로 이동한다', () => {
    cy.step('로그인004 · 비밀번호 찾기 링크');
    cy.contains('비밀번호 찾기').click();
    cy.location('pathname').should('eq', '/Find');
  });

  it('로그인005 | "회원가입"을 누르면 회원가입 페이지로 이동한다', () => {
    cy.step('로그인005 · 회원가입 링크');
    cy.contains('회원가입').click();
    cy.location('pathname').should('eq', '/Join');
  });

  it('로그인008 | 형식에 맞지 않는 입력에 유효성 메시지가 뜬다', () => {
    cy.step('로그인008 · 잘못된 이메일 형식 / 짧은 비밀번호');
    cy.get(EMAIL).type('not-an-email');
    cy.get(PW).type('123', { log: false }).blur();
    cy.contains('유효한 이메일 형식이 아닙니다.').should('be.visible');
    cy.contains(
      '비밀번호는 8~15자의 영문, 숫자, 특수문자 조합이어야 합니다.'
    ).should('be.visible');
    cy.get(SUBMIT).should('be.disabled');
    cy.capture('로그인008-유효성');
  });

  it('로그인009 | 로그인 후 새로고침해도 로그인 상태가 유지된다', () => {
    cy.step('로그인009 · 로그인 후 새로고침');
    cy.get(EMAIL).type(user().email);
    cy.get(PW).type(user().password, { log: false });
    cy.get(SUBMIT).click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/');
    cy.reload();
    cy.get('header').contains('님', { timeout: 15000 }).should('be.visible');
    cy.capture('로그인009-상태유지');
  });

  it('로그인010 | 로그인 실패해도 입력한 값은 그대로 남는다', () => {
    cy.step('로그인010 · 실패 후 입력 필드 유지');
    cy.get(EMAIL).type(user().email);
    cy.get(PW).type('Wrong1234!', { log: false });
    cy.get(SUBMIT).click();
    cy.wait('@login');
    cy.get(EMAIL).should('have.value', user().email);
    cy.get(PW).should('have.value', 'Wrong1234!');
  });

  it('간편 로그인001 | 카카오/네이버 간편 로그인 버튼이 노출된다', () => {
    cy.step('간편 로그인001 · 소셜 로그인 버튼 노출 확인');
    cy.contains('button', '카카오로 시작하기').should('be.visible');
    cy.contains('button', '네이버로 시작하기').should('be.visible');
    cy.capture('간편로그인001-버튼노출');
    // 실제 클릭은 nid.naver.com / kauth.kakao.com으로 이탈해 Cypress 세션이 끊긴다 → 수동 QA.
  });
});

describe('로그아웃', () => {
  it('로그인한 사용자가 헤더에서 로그아웃하면 비로그인 상태로 돌아간다', () => {
    cy.step('로그아웃 · 헤더 로그아웃 → 확인 모달 → 홈');
    cy.login();
    cy.visit('/');
    cy.get('header').contains('button', '로그아웃').click();
    cy.contains('로그아웃 하시겠습니까?')
      .parent()
      .contains('button', '로그아웃')
      .click();
    cy.get('header')
      .contains('로그인', { timeout: 15000 })
      .should('be.visible');
    cy.getCookie('accessToken').should('not.exist');
    cy.capture('로그아웃-완료');
  });
});

/*
 * 자동화 제외
 * - 간편 로그인002~009 (네이버/카카오 실제 인증, 회원 통합): 서드파티 인증 화면 + 실제 계정 생성이 필요 → 수동 QA.
 * - 로그인006, 007: Notion QA 표에 항목 없음(결번).
 */
