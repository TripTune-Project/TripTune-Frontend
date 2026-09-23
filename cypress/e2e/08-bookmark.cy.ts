/**
 * QA 모음 > 북마크 / 내 일정 담기 (북마크001 ~ 006, 일정담기001)
 *
 * 테스트가 QA 계정에 데이터를 남기지 않도록, 이 spec이 추가한 북마크만 afterEach에서 API로 정리한다.
 */
describe('북마크', () => {
  let addedPlaceId: number | null = null;
  let addedPlaceName = '';

  const api = () => Cypress.env('apiUrl') as string;

  const withToken = (fn: (token: string) => void) =>
    cy.getCookie('accessToken').then((c) => {
      if (c) fn(decodeURIComponent(c.value));
    });

  beforeEach(() => {
    addedPlaceId = null;
    cy.login();
    cy.stubGeolocation();
    cy.intercept('POST', '**/api/travels?page=*').as('list');
    cy.intercept('GET', '**/api/travels/*').as('detail');
    cy.intercept('POST', '**/api/bookmarks').as('addBookmark');
    cy.intercept('DELETE', '**/api/bookmarks/*').as('removeBookmark');
    cy.visit('/Travel');
    cy.wait('@list').then((i: any) => {
      const first = i.response.body?.data?.content?.[0];
      addedPlaceId = first?.placeId ?? null;
      addedPlaceName = first?.placeName ?? '';
    });
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
  });

  afterEach(() => {
    // 이 spec이 건드린 여행지의 북마크만 원복한다.
    if (!addedPlaceId) return;
    withToken((token) => {
      cy.request({
        method: 'DELETE',
        url: `${api()}/api/bookmarks/${addedPlaceId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      });
    });
  });

  it('북마크006 | 북마크 추가 API가 성공하고 마이페이지 북마크 목록에 반영된다', () => {
    cy.step('북마크006 · 목록에서 북마크 추가 → 마이페이지에 반영');
    cy.get('ul li').first().find('button').first().click();
    cy.wait('@addBookmark').its('response.statusCode').should('eq', 200);
    cy.capture('북마크006-추가');

    cy.intercept('GET', '**/api/members/bookmark*').as('myBookmarks');
    cy.visit('/MyPage');
    cy.contains('북마크').click();
    cy.wait('@myBookmarks').its('response.statusCode').should('eq', 200);
    cy.then(() => cy.contains(addedPlaceName).should('be.visible'));
    cy.capture('북마크006-마이페이지반영');
  });

  it('북마크004 | 마이페이지에서 북마크를 해제하면 목록에서 사라진다', () => {
    cy.step('북마크004 · 추가 후 마이페이지에서 해제');
    cy.get('ul li').first().find('button').first().click();
    cy.wait('@addBookmark');

    cy.intercept('GET', '**/api/members/bookmark*').as('myBookmarks');
    cy.visit('/MyPage');
    cy.contains('북마크').click();
    cy.wait('@myBookmarks');
    cy.then(() => {
      cy.contains(addedPlaceName)
        .closest('[class*="bookmarkCard"]')
        .find('[class*="bookmarkIconBox"]')
        .click();
      cy.wait('@removeBookmark').its('response.statusCode').should('eq', 200);
      cy.wait('@myBookmarks');
      cy.contains(addedPlaceName).should('not.exist');
    });
    cy.capture('북마크004-해제');
  });

  it('북마크002 | 북마크 추가 후 목록의 북마크 아이콘이 채워진 상태로 바뀐다', () => {
    cy.step('북마크002 · 추가 직후 목록 아이콘 상태');
    cy.get('ul li').first().find('button').first().click();
    cy.wait('@addBookmark').its('response.statusCode').should('eq', 200);
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    // 목록 재조회 응답의 bookmarkStatus가 true여야 아이콘이 채워진다
    cy.get('ul li')
      .first()
      .find('button img')
      .first()
      .should('have.attr', 'alt', '북마크');
    cy.capture('북마크002-아이콘상태');
  });

  it('북마크003 | 북마크 추가 후 새로고침해도 상태가 유지된다', () => {
    cy.step('북마크003 · 추가 → 새로고침 → 상태 유지');
    cy.get('ul li').first().find('button').first().click();
    cy.wait('@addBookmark');
    cy.reload();
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li')
      .first()
      .find('button img')
      .first()
      .should('have.attr', 'alt', '북마크');
    cy.capture('북마크003-새로고침유지');
  });

  it('북마크005 | 상세 화면에서도 북마크 상태가 일관되게 보인다', () => {
    cy.step('북마크005 · 목록에서 북마크 → 상세에서 동일 상태');
    cy.get('ul li').first().find('button').first().click();
    cy.wait('@addBookmark');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li').first().click();
    cy.location('pathname', { timeout: 15000 }).should(
      'match',
      /^\/Travel\/\d+$/
    );
    cy.wait('@detail');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    // 상세 버튼 라벨: 북마크됨 → '북마크 해제', 아니면 '북마크'
    cy.get('button:has(img[alt="북마크"])').should('have.text', '북마크 해제');
    cy.capture('북마크005-상세일관성');
  });
});

describe('내 일정 담기', () => {
  it('일정담기001 | "내 일정 담기" 모달에 편집 가능한 일정 목록이 표시된다', () => {
    cy.step('일정담기001 · 상세에서 내 일정 담기 모달 열기');
    cy.login();
    cy.stubGeolocation();
    cy.intercept('GET', '**/api/schedules/edit*').as('editable');
    cy.visit('/Travel');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li').first().click();
    cy.location('pathname', { timeout: 15000 }).should(
      'match',
      /^\/Travel\/\d+$/
    );
    cy.contains('button', '내 일정 담기').click();
    cy.wait('@editable').its('response.statusCode').should('eq', 200);
    cy.contains('여행지를 추가하고 싶은 일정을 선택하세요.').should(
      'be.visible'
    );
    cy.capture('일정담기001-모달');
  });
});

/*
 * 자동화 제외
 * - 일정담기002, 005 (실제 일정에 여행지 추가): 일정의 여행 루트가 영구 변경됨 → 수동 QA.
 * - 일정담기004 무한 스크롤: QA 계정 일정이 1페이지 이하면 검증 불가 → 데이터 준비 후 수동.
 */
