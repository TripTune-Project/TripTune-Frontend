describe('홈', () => {
  it('메인 페이지가 열리고 캡처된다', () => {
    // 인기 여행지·추천 테마 응답이 오기 전에 찍으면 스피너 상태로 캡처된다.
    cy.intercept('GET', '**/api/travels/popular*').as('popular');
    cy.intercept('GET', '**/api/travels/recommend*').as('recommend');
    cy.visit('/');
    cy.wait(['@popular', '@recommend']);
    cy.get('header').should('be.visible');
    cy.capture('home');
  });

  it('window 스크롤이 동작한다 (body가 스크롤 컨테이너가 아님)', () => {
    cy.visit('/');
    cy.window().then((win) => win.scrollTo(0, 500));
    cy.window().its('scrollY').should('be.gt', 0);
    cy.window().then((win) => win.scrollTo(0, 0));
    cy.window().its('scrollY').should('eq', 0);
  });
});
