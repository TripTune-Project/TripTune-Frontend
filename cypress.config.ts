import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5814',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  video: true, // cypress run 시 spec별 mp4 → cypress/videos
  screenshotOnRunFailure: true, // 실패 시 자동 캡처 → cypress/screenshots
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  defaultCommandTimeout: 8000,
});
