/// <reference types="cypress" />

declare namespace Cypress {
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