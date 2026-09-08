describe('홈', () => {
  it('메인 페이지가 열리고 캡처된다', () => {
    cy.visit('/');
    cy.get('header').should('be.visible');
    cy.capture('home');
  });
});
