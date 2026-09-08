// 모든 spec 실행 전에 한 번 로드되는 파일. 커스텀 커맨드는 여기 추가.

// ponytail: 페이지 진입 캡처용 헬퍼 하나만. 요소 캡처는 cy.get(...).screenshot() 그대로 사용.
Cypress.Commands.add('capture', (name: string) => {
  // 로딩 스피너(DataLoading)가 남아 있으면 캡처 중 페이지 높이가 바뀌어 조각이 겹친다.
  cy.get('[role="status"]', { timeout: 15000 }).should('not.exist');
  cy.screenshot(name, { capture: 'fullPage', overwrite: true });
});

declare global {
  namespace Cypress {
    interface Chainable {
      /** 전체 페이지 스크린샷을 cypress/screenshots/<spec>/<name>.png 로 저장 */
      capture(name: string): Chainable<void>;
    }
  }
}

export {};
