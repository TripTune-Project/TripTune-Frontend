// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import type { User } from '@/types/user';
import type { TestTravel } from '@/types/travel';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      resetDatabase(): Chainable<void>;
      createTestUser(userData: Partial<User>): Chainable<User>;
      createTestTravel(travelData: Partial<TestTravel>): Chainable<TestTravel>;
      deleteTestTravel(travelId: number): Chainable;
      handleApiError(error: any): Chainable<void>;
    }
  }
}

// 테스트 ID로 요소 선택하는 커스텀 명령어
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// 데이터베이스 초기화
Cypress.Commands.add('resetDatabase', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/test/reset`,
    headers: {
      'X-Test-Key': Cypress.env('testApiKey')
    }
  });
});

// 테스트 사용자 생성
Cypress.Commands.add('createTestUser', (userData: Partial<User>) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/test/users`,
    headers: {
      'X-Test-Key': Cypress.env('testApiKey')
    },
    body: userData
  }).its('body');
});

// 테스트 여행 생성
Cypress.Commands.add('createTestTravel', (travelData: Partial<TestTravel>) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/test/travels`,
    headers: {
      'X-Test-Key': Cypress.env('testApiKey')
    },
    body: travelData
  }).its('body');
});

// 테스트 여행 삭제
Cypress.Commands.add('deleteTestTravel', (travelId: number) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/test/travels/${travelId}`,
  });
});

// API 에러 처리
Cypress.Commands.add('handleApiError', (error: any) => {
  cy.log('API Error:', error);
  // 에러 로깅 및 알림 처리
  if (error.response) {
    cy.getByTestId('error-message').should('be.visible');
  }
});

// 로그인 커스텀 명령어
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.getByTestId('email-input').type(email);
    cy.getByTestId('password-input').type(password, { log: false });
    cy.getByTestId('login-button').click();
    cy.url().should('not.include', '/login');
  });
});

// 로그아웃 커스텀 명령어
Cypress.Commands.add('logout', () => {
  cy.getByTestId('logout-button').click();
  cy.url().should('include', '/login');
}); 