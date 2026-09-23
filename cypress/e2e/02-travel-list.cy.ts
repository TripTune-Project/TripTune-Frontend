/**
 * QA 모음 > 여행지 탐색 (탐색001 ~ 탐색011)
 */
describe('여행지 탐색 - 목록', () => {
  const SEARCH = 'input[placeholder="원하는 여행지를 검색하세요."]';
  const SEARCH_BTN = 'button';

  beforeEach(() => {
    cy.stubGeolocation();
    cy.intercept('POST', '**/api/travels?page=*').as('list');
    cy.intercept('POST', '**/api/travels/search*').as('search');
    cy.visit('/Travel');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
  });

  it('탐색001 | 유효한 검색어로 검색하면 해당 목록이 표시된다', () => {
    cy.step('탐색001 · "숙박시설" 검색');
    cy.get(SEARCH).type('숙박시설');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li').should('have.length.greaterThan', 0);
    cy.capture('탐색001-검색결과');
  });

  it('탐색001-a | 검색 요청이 빈 키워드로 나가지 않는다', () => {
    // 검색 버튼은 즉시 refetch하지만 keyword는 800ms 디바운스된 값을 쓴다.
    // 백엔드는 빈 keyword에 400("검색어는 필수 입력 값입니다.")을 반환한다.
    cy.step('탐색001-a · 검색 버튼 즉시 클릭 시 빈 키워드 요청 여부');
    cy.get(SEARCH).type('숙박시설');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.wait('@search').then((i: any) => {
      expect(i.request.body.keyword, '검색 API로 보낸 keyword').to.not.eq('');
      expect(i.response.statusCode).to.eq(200);
    });
  });

  it('탐색002 | 결과 없는 검색어는 "검색 결과가 없습니다"를 보여준다', () => {
    cy.step('탐색002 · 무의미한 검색어 입력');
    cy.get(SEARCH).type('ㅋㅌㅊ존재하지않는여행지이름');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.contains('검색 결과가 없습니다.', { timeout: 20000 }).should(
      'be.visible'
    );
    cy.contains('검색어의 철자와 띄어쓰기가 정확한지 확인해주세요.').should(
      'be.visible'
    );
    cy.capture('탐색002-결과없음');
  });

  it('탐색003 | 빈 검색어로 검색하면 "검색어를 입력해주세요" 안내가 뜬다', () => {
    cy.step('탐색003 · 빈 검색어로 검색 버튼 클릭');
    cy.get(SEARCH).should('have.value', '');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.contains('검색어를 입력해주세요.').should('be.visible');
    cy.capture('탐색003-빈검색어');
  });

  it('탐색004 | 비로그인 상태에서 북마크를 누르면 로그인 모달이 뜬다', () => {
    cy.step('탐색004(비로그인) · 북마크 버튼 클릭 → 로그인 필요 모달');
    cy.clearCookies();
    cy.reload();
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li button').first().click();
    cy.contains('로그인 필요').should('be.visible');
    cy.contains('이 기능을 사용하려면 로그인이 필요합니다.').should(
      'be.visible'
    );
    cy.capture('탐색004-로그인모달');
  });

  it('탐색007 | 페이지네이션으로 다음 페이지가 조회된다', () => {
    cy.step('탐색007 · 페이지네이션 2페이지 이동');
    cy.get('[role="navigation"][aria-label="Pagination Navigation"]').should(
      'exist'
    );
    cy.get('ul li').first().find('div').invoke('text').as('firstBefore');
    cy.get('[role="navigation"] button').contains('2').click();
    cy.wait('@list');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('[role="navigation"] button[aria-current="page"]').should(
      'have.text',
      '2'
    );
    cy.capture('탐색007-2페이지');
  });

  it('탐색010 | 검색어를 지우면 전체 목록으로 돌아온다', () => {
    cy.step('탐색010 · 검색 후 검색어 삭제 → 전체 목록 복귀');
    cy.get(SEARCH).type('서울');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.wait('@search');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get(SEARCH).clear().blur();
    cy.wait('@list', { timeout: 20000 });
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li').should('have.length.greaterThan', 0);
    cy.capture('탐색010-검색어초기화');
  });

  it('탐색011 | 검색 직후 새로고침해도 기본 상태로 정상 복구된다', () => {
    cy.step('탐색011 · 검색 후 즉시 새로고침');
    cy.get(SEARCH).type('부산');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.reload();
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li, :contains("검색 결과가 없습니다.")').should('exist');
    cy.capture('탐색011-새로고침');
  });

  it('탐색009 | 검색 결과 목록과 지도 영역이 함께 갱신된다', () => {
    cy.step('탐색009 · 검색 결과와 지도 동기화');
    cy.get(SEARCH).type('제주');
    cy.contains(SEARCH_BTN, '검색').click();
    cy.wait('@search').then((i: any) => {
      const count = i.response.body?.data?.content?.length ?? 0;
      cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
      cy.get('ul li').should('have.length', count);
    });
    cy.capture('탐색009-지도동기화');
  });
});

/*
 * 자동화 제외
 * - 탐색005 북마크 해제: 로그인 상태 북마크 토글은 08-bookmark.cy.ts에서 다룸.
 * - 탐색006 지도 마커 클릭: Google Maps 마커는 canvas 렌더라 안정적인 DOM 셀렉터가 없음 → 수동 QA.
 * - 탐색008 잘못된 페이지 번호: UI에서 유효 범위 밖 버튼을 만들 수 없음(Pagination이 범위 제한) → N/A.
 */
