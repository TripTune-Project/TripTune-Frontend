// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      // 커스텀 명령어 타입 정의
      login(email: string, password: string): Chainable<void>;
    }
  }
}

// 기본 설정
Cypress.on('uncaught:exception', (err, runnable) => {
  // 예외가 발생해도 테스트를 계속 진행
  return false;
}); 