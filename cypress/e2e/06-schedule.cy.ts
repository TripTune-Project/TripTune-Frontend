/**
 * QA 모음 > 일정 만들기
 *   - 최근 목록 (일정최근001 ~ 011, 일정추가016 ~ 019)
 *   - 캘린더 모달 (캘린더008 ~ 013)
 *
 * 실제 일정 생성/삭제는 QA 계정의 운영 데이터를 바꾸므로 자동화하지 않는다.
 */
describe('일정 만들기 - 비로그인', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('일정최근001 | 비로그인 상태로 네비바 "일정 만들기"를 누르면 로그인 모달이 뜬다', () => {
    cy.step('일정최근001 · 비로그인 상태에서 네비바 일정 만들기');
    cy.visit('/');
    cy.get('header').contains('일정 만들기').click();
    cy.location('pathname').should('eq', '/Schedule');
    cy.contains('로그인 필요', { timeout: 15000 }).should('be.visible');
    cy.capture('일정최근001-로그인모달');
  });

  it('일정최근002 | 비로그인 상태로 /Schedule 직접 접근 시 접근이 차단된다', () => {
    cy.step('일정최근002 · URL 직접 접근 차단');
    cy.visit('/Schedule');
    cy.contains('로그인 필요', { timeout: 15000 }).should('be.visible');
    cy.contains('전체 일정').should('not.exist');
    cy.contains('일정을 검색하세요.').should('not.exist');
    cy.capture('일정최근002-접근차단');
  });

  it('일정최근003 | 로그인 모달의 "로그인"을 누르면 로그인 페이지로 이동한다', () => {
    cy.step('일정최근003 · 모달 → 로그인 페이지 이동');
    cy.visit('/Schedule');
    cy.contains('로그인 필요', { timeout: 15000 }).should('be.visible');
    cy.contains('button', '로그인').click();
    cy.location('pathname').should('eq', '/Login');
  });
});

describe('일정 만들기 - 로그인', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/api/schedules?page=*').as('all');
    cy.intercept('GET', '**/api/schedules/shared?page=*').as('shared');
    cy.intercept('GET', '**/api/schedules/search?*').as('search');
    cy.visit('/Schedule');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
  });

  it('일정최근004 | 일정 목록 API가 정상 응답한다', () => {
    cy.step('일정최근004 · 일정 목록 API 응답 확인');
    cy.wait('@all').its('response.statusCode').should('eq', 200);
    cy.capture('일정최근004-목록로드');
  });

  it('일정최근006 | "전체 일정"·"공유된 일정" 탭이 기본 노출된다', () => {
    cy.step('일정최근006 · 초기 탭 상태');
    cy.contains('전체 일정').should('be.visible');
    cy.contains('공유된 일정').should('be.visible');
    cy.capture('일정최근006-초기상태');
  });

  it('일정최근008 | 탭을 전환하면 목록 데이터가 갱신된다', () => {
    cy.step('일정최근008 · 공유된 일정 탭 클릭');
    cy.contains('공유된 일정').click();
    cy.wait('@shared').its('response.statusCode').should('eq', 200);
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.capture('일정최근008-공유탭');
  });

  it('일정추가018 | 존재하지 않는 검색어는 "검색 결과가 없습니다"를 보여준다', () => {
    cy.step('일정추가018 · 없는 일정명으로 검색');
    cy.get('input[placeholder="일정을 검색하세요."]').type(
      'ㅋㅌㅊ존재하지않는일정명'
    );
    cy.get('button[title="일정 검색"]').click();
    cy.contains('검색 결과가 없습니다.', { timeout: 20000 }).should(
      'be.visible'
    );
    cy.capture('일정추가018-검색결과없음');
  });

  it('일정추가017 | 검색 결과가 검색어와 일치한다', () => {
    cy.step('일정추가017 · 일정명 검색');
    cy.get('body').then(($b) => {
      if ($b.find('[class*="scheduleName"]').length === 0) {
        cy.log('QA 계정에 일정이 없어 검색 검증 불가 — 해당 없음');
        return;
      }
      cy.get('[class*="scheduleName"]')
        .first()
        .invoke('text')
        .then((name) => {
          const keyword = name.trim().slice(0, 2);
          cy.get('input[placeholder="일정을 검색하세요."]')
            .clear()
            .type(keyword);
          cy.get('button[title="일정 검색"]').click();
          cy.wait('@search').its('response.statusCode').should('eq', 200);
          cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
          cy.get('[class*="scheduleName"]').each(($el) => {
            expect($el.text()).to.include(keyword);
          });
          cy.capture('일정추가017-검색결과');
        });
    });
  });

  it('일정최근005 / 캘린더013 | "일정 만들기" 버튼으로 캘린더 모달이 열리고 닫힌다', () => {
    cy.step('일정최근005 · 캘린더 모달 열기');
    cy.contains('button', '일정 만들기').click();
    cy.contains('여행 이름').should('be.visible');
    cy.get('input[placeholder="여행 이름을 입력해주세요."]').should(
      'be.visible'
    );
    cy.get('.react-datepicker').should('be.visible');
    cy.capture('일정최근005-캘린더모달');

    cy.step('캘린더013 · 모달 닫기(×) 버튼');
    cy.contains('button', '\u00d7').click();
    cy.get('input[placeholder="여행 이름을 입력해주세요."]').should(
      'not.exist'
    );
  });

  it('캘린더012 | 필수 입력값이 비면 생성 버튼이 비활성이다', () => {
    cy.step('캘린더012 · 여행 이름/날짜 미입력');
    cy.contains('button', '일정 만들기').click();
    cy.get('input[placeholder="여행 이름을 입력해주세요."]').should(
      'have.value',
      ''
    );
    cy.contains('button', '생성').should('be.disabled');
    cy.capture('캘린더012-생성버튼비활성');
  });

  it('캘린더008 | 여행 이름이 공백이면 생성할 수 없다', () => {
    cy.step('캘린더008 · 여행 이름 공백 입력');
    cy.contains('button', '일정 만들기').click();
    cy.get('input[placeholder="여행 이름을 입력해주세요."]').type('   ');
    cy.contains('button', '생성').should('be.disabled');
    cy.capture('캘린더008-공백이름');
  });
});

/*
 * 자동화 제외 (운영 데이터 변경 / 서드파티)
 * - 일정최근009, 010 (일정 나가기·삭제), 캘린더003, 011 (실제 생성): QA 계정 데이터가 영구 변경됨 → 수동 QA.
 * - 일정최근011 무한스크롤 / 일정추가029, 030 정렬: QA 계정 일정 수가 1페이지 이하면 검증 불가 → 데이터 준비 후 수동.
 * - 세부목록001~024 (일정 상세/채팅/공유): STOMP 실시간 + 다중 계정 동시 접속이 필요 → 수동 QA.
 * - 캘린더009, 010 날짜 범위: react-datepicker가 역순 선택 자체를 막고 있어 UI로 재현 불가 → N/A.
 */
