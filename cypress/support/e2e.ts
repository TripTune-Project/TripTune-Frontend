// 모든 spec 실행 전에 한 번 로드되는 파일. 커스텀 커맨드는 여기 추가.

// ponytail: 페이지 진입 캡처용 헬퍼 하나만. 요소 캡처는 cy.get(...).screenshot() 그대로 사용.
// global.css가 html/body에 height:100% + overflow-x:hidden을 걸어 body가 스크롤 컨테이너가 되는데,
// fullPage 캡처는 window를 스크롤하며 조각을 이어 붙이므로 캡처 동안만 문서 흐름으로 되돌린다.
Cypress.Commands.add('capture', (name: string) => {
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.id = 'cy-capture-fix';
    style.textContent =
      'html,body{height:auto!important;overflow:visible!important}';
    doc.head.appendChild(style);
  });
  cy.screenshot(name, { capture: 'fullPage', overwrite: true });
  cy.document().then((doc) => doc.getElementById('cy-capture-fix')?.remove());
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
