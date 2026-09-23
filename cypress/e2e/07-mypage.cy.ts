/**
 * QA 모음 > 마이페이지 (프로필003, 계정002·004, 북마크001 ~ 004)
 *
 * 프로필/이메일/비밀번호 실제 변경과 계정 탈퇴는 QA 계정을 되돌릴 수 없으므로 자동화하지 않는다.
 * 여기서는 조회 + 입력 유효성만 검증한다.
 */
describe('마이페이지', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/api/members/info').as('info');
    cy.intercept('GET', '**/api/members/bookmark*').as('bookmarks');
    cy.visit('/MyPage');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
  });

  it('마이페이지 진입 | 프로필 탭이 기본으로 열리고 사용자 정보가 표시된다', () => {
    cy.step('마이페이지 · 진입 시 프로필 탭 기본 표시');
    cy.contains('프로필 관리').should('be.visible');
    cy.contains('계정 관리').should('be.visible');
    cy.contains('북마크').should('be.visible');
    cy.contains('닉네임').should('be.visible');
    cy.capture('마이페이지-프로필탭');
  });

  it('프로필003 | 닉네임을 비우고 저장하면 안내 메시지가 뜬다', () => {
    cy.step('프로필003 · 빈 닉네임으로 저장 시도');
    cy.contains('닉네임').parent().contains('button', '변경').click();
    cy.get('input[placeholder^="닉네임"]').clear();
    cy.contains('button', '저장').click();
    cy.contains('닉네임을 입력해주세요.').should('be.visible');
    cy.capture('프로필003-빈닉네임');
  });

  it('계정002 | 잘못된 이메일 형식이면 안내 메시지가 뜬다', () => {
    cy.step('계정002 · 잘못된 이메일 형식 입력');
    cy.contains('계정 관리').click();
    cy.contains('이메일').should('be.visible');
    cy.contains('button', '변경').first().click();
    cy.get('input[placeholder="이메일"]').clear().type('not-an-email').blur();
    cy.capture('계정002-이메일형식');
  });

  it('계정004 | 새 비밀번호와 확인 값이 다르면 안내 메시지가 뜬다', () => {
    cy.step('계정004 · 비밀번호 불일치');
    cy.contains('계정 관리').click();
    cy.get('body').then(($b) => {
      if ($b.find('input[placeholder="현재 비밀번호"]').length === 0) {
        cy.contains('비밀번호').parent().contains('button', '변경').click();
      }
    });
    cy.get('input[placeholder="현재 비밀번호"]').type('Abcd1234!', {
      log: false,
    });
    cy.get('input[placeholder^="새 비밀번호"]').type('Abcd1234!', {
      log: false,
    });
    cy.get('input[placeholder*="재입력"], input[placeholder*="확인"]')
      .first()
      .type('Zzzz9999!', { log: false })
      .blur();
    cy.capture('계정004-비밀번호불일치');
  });

  it('북마크001 | 북마크 목록이 로드된다', () => {
    cy.step('북마크001 · 북마크 탭 목록 조회');
    cy.contains('북마크').click();
    cy.wait('@bookmarks').its('response.statusCode').should('eq', 200);
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.capture('북마크001-목록');
  });

  it('북마크003 | 정렬 기준을 바꾸면 목록이 다시 조회된다', () => {
    cy.step('북마크003 · 정렬 기준 변경 (최신순 → 이름 순)');
    cy.contains('북마크').click();
    cy.wait('@bookmarks');
    cy.get('select').select('name');
    cy.wait('@bookmarks').then((i: any) => {
      expect(i.request.url).to.include('sort=name');
    });
    cy.capture('북마크003-정렬변경');
  });

  it('북마크004 | 북마크가 여러 페이지면 페이지네이션이 동작한다', () => {
    cy.step('북마크004 · 페이지네이션 확인');
    cy.contains('북마크').click();
    cy.wait('@bookmarks');
    cy.get('body').then(($b) => {
      if ($b.find('[aria-label="Pagination Navigation"]').length === 0) {
        cy.log('북마크가 1페이지 이하 — 페이지네이션 해당 없음');
        return;
      }
      cy.get('[aria-label="Pagination Navigation"] button')
        .contains('2')
        .click();
      cy.wait('@bookmarks').its('request.url').should('include', 'page=2');
      cy.capture('북마크004-2페이지');
    });
  });
});

/*
 * 자동화 제외 (되돌릴 수 없는 계정 변경)
 * - 프로필001, 002 (이미지·닉네임 실제 변경), 계정001, 003 (이메일·비밀번호 실제 변경): QA 계정이 영구 변경됨 → 수동 QA.
 * - 탈퇴001 ~ 003: 계정이 삭제됨. 자동화 금지.
 * - 북마크002 (북마크 삭제): 08-bookmark.cy.ts에서 추가→해제로 원복 가능한 형태로만 검증.
 */
