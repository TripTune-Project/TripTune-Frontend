/**
 * QA 모음 > 로그인 / 회원가입 / 비밀번호 찾기
 *   - 회원가입 페이지 (회원가입002, 009 ~ 016)
 *   - 비밀번호 찾기 (비밀번호002, 003)
 *
 * 실제 가입 완료·인증 메일 발송은 운영 DB/메일을 건드리므로 자동화하지 않는다.
 * 여기서는 "가입 버튼을 누르기 전"까지의 유효성 검증만 다룬다.
 */
describe('회원가입 - 입력 유효성', () => {
  const NICK = 'input[placeholder^="닉네임"]';
  const PW = 'input[placeholder^="비밀번호 ("]';
  const PW2 = 'input[placeholder="비밀번호 재입력"]';
  const AGREE = 'input[type="checkbox"]';
  const SUBMIT = 'button[type="submit"]';

  beforeEach(() => {
    cy.visit('/Join');
  });

  it('회원가입009 | 약관 미동의 상태에서는 가입 버튼이 비활성이다', () => {
    cy.step('회원가입009 · 개인정보 수집 동의 미체크');
    cy.get(AGREE).should('not.be.checked');
    cy.get(SUBMIT).should('be.disabled');
    cy.capture('회원가입009-약관미동의');
  });

  it('회원가입010 | 비밀번호와 재입력이 다르면 불일치 메시지가 뜬다', () => {
    cy.step('회원가입010 · 비밀번호 불일치');
    cy.get(PW).type('Abcd1234!', { log: false });
    cy.get(PW2).type('Abcd9999!', { log: false }).blur();
    cy.contains('비밀번호가 일치하지 않습니다.').should('be.visible');
    cy.capture('회원가입010-비밀번호불일치');
  });

  it('회원가입013 | 규칙에 맞지 않는 닉네임은 안내 메시지가 뜬다', () => {
    cy.step('회원가입013 · 특수문자 포함 닉네임');
    cy.get(NICK).type('닉!@#').blur();
    cy.contains('닉네임은 4~15자의 영문, 한글, 숫자만 사용 가능합니다.').should(
      'be.visible'
    );
    cy.capture('회원가입013-닉네임유효성');
  });

  it('회원가입014 | 비밀번호 입력값이 화면에 노출되지 않는다', () => {
    cy.step('회원가입014 · 비밀번호 필드 마스킹');
    cy.get(PW).should('have.attr', 'type', 'password');
    cy.get(PW2).should('have.attr', 'type', 'password');
  });

  it('회원가입012 | 필수 값이 비면 가입 버튼이 비활성이다', () => {
    cy.step('회원가입012 · 필수 입력값 미입력');
    cy.get(SUBMIT).should('be.disabled');
    cy.get(NICK).type('testnick01');
    cy.get(SUBMIT).should('be.disabled');
  });

  it('회원가입016 | 새로고침하면 입력값이 모두 초기화된다', () => {
    cy.step('회원가입016 · 입력 후 새로고침');
    cy.get(NICK).type('testnick01');
    cy.get(PW).type('Abcd1234!', { log: false });
    cy.reload();
    cy.get(NICK).should('have.value', '');
    cy.get(PW).should('have.value', '');
    cy.capture('회원가입016-새로고침초기화');
  });

  it('회원가입002 | 이미 가입된 이메일로 인증 요청하면 중복 안내가 뜬다', () => {
    cy.step('회원가입002 · 중복 이메일 인증 요청');
    const { email } = Cypress.env('testUser') as { email: string };
    cy.intercept('POST', '**/api/emails/verify-request').as('verifyReq');
    cy.get('input[placeholder="이메일 인증"]').type(email);
    cy.contains('button', /인증|요청|전송/)
      .first()
      .click();
    cy.wait('@verifyReq', { timeout: 20000 });
    cy.get('.MuiAlert-message, p')
      .contains(/이미.*이메일/)
      .should('be.visible');
    cy.capture('회원가입002-중복이메일');
  });
});

describe('비밀번호 찾기', () => {
  const EMAIL = 'input[placeholder="이메일 주소 입력"]';
  const SUBMIT = 'button[type="submit"]';

  beforeEach(() => {
    cy.visit('/Find');
  });

  it('비밀번호003 | 이메일을 비우면 전송 버튼이 비활성이다', () => {
    cy.step('비밀번호003 · 빈 이메일');
    cy.get(SUBMIT).should('be.disabled');
    cy.capture('비밀번호003-빈이메일');
  });

  it('비밀번호002 | 잘못된 이메일 형식이면 안내 메시지가 뜬다', () => {
    cy.step('비밀번호002 · 잘못된 이메일 형식');
    cy.get(EMAIL).type('not-an-email').blur();
    cy.contains('유효한 이메일 형식이 아닙니다.').should('be.visible');
    cy.get(SUBMIT).should('be.disabled');
    cy.capture('비밀번호002-형식오류');
  });
});

/*
 * 자동화 제외 (운영 데이터/메일 발송을 일으킴)
 * - 회원가입001, 003 ~ 008: 실제 계정 생성 및 인증 메일 수신 필요 → 수동 QA.
 * - 회원가입011, 015: Notion QA 표 기준 결번 / 포커스 이동은 브라우저 기본 동작 → 수동 확인.
 * - 비밀번호001, 004 ~ 007: 재설정 메일 발송·링크 만료 검증 필요 → 수동 QA.
 */
