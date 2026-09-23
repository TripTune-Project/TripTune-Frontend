// 모든 spec 실행 전에 한 번 로드되는 파일. 커스텀 커맨드는 여기 추가.

// ponytail: 페이지 진입 캡처용 헬퍼 하나만. 요소 캡처는 cy.get(...).screenshot() 그대로 사용.
Cypress.Commands.add('capture', (name: string) => {
  // 로딩 스피너(DataLoading)가 남아 있으면 캡처 중 페이지 높이가 바뀌어 조각이 겹친다.
  cy.get('[role="status"]', { timeout: 15000 }).should('not.exist');
  // fullPage는 뷰포트 단위로 이어 붙이므로 position:fixed인 자막이 조각마다 복제된다.
  cy.screenshot(name, {
    capture: 'fullPage',
    overwrite: true,
    onBeforeScreenshot: ($el) => {
      $el.find('#cy-step-caption').hide();
    },
    onAfterScreenshot: ($el) => {
      $el.find('#cy-step-caption').show();
    },
  });
});

// 녹화 영상에 음성 대신 텍스트 자막을 남긴다. AUT 문서 위에 고정 배너를 그려서
// mp4만 봐도 지금 어떤 QA 케이스를 검증 중인지 읽히게 한다.
let lastStep = '';

const drawCaption = (label: string) =>
  cy.document({ log: false }).then((doc) => {
    let bar = doc.getElementById('cy-step-caption');
    if (!bar) {
      bar = doc.createElement('div');
      bar.id = 'cy-step-caption';
      bar.setAttribute(
        'style',
        [
          'position:fixed',
          'left:0',
          'right:0',
          'bottom:0',
          'z-index:2147483647',
          'padding:10px 16px',
          'background:rgba(17,17,17,.88)',
          'color:#fff',
          'font:600 15px/1.4 "Noto Sans KR",sans-serif',
          'letter-spacing:-.2px',
          'pointer-events:none',
          'white-space:pre-wrap',
        ].join(';')
      );
      doc.body.appendChild(bar);
    }
    bar.textContent = `\u25b6 ${label}`;
  });

Cypress.Commands.add('step', (label: string) => {
  lastStep = label;
  cy.log(`**${label}**`);
  drawCaption(label);
});

// 페이지가 새로 로드되면 배너가 날아가므로 visit 직후 마지막 자막을 다시 그린다.
Cypress.Commands.overwrite('visit', (orig: any, ...args: any[]) =>
  orig(...args).then((subject: any) => {
    if (lastStep) drawCaption(lastStep);
    return subject;
  })
);

// QA 계정 로그인. cy.session으로 spec 간 재사용하되,
// 다른 spec의 로그아웃으로 서버에서 죽은 토큰을 물고 가지 않도록 validate로 검증한다.
Cypress.Commands.add('login', () => {
  const { email, password } = Cypress.env('testUser');
  cy.session(
    ['qa-user', email],
    () => {
      cy.visit('/Login');
      cy.get('input[placeholder="이메일"]').type(email);
      cy.get('input[placeholder="비밀번호"]').type(password, { log: false });
      cy.get('button[type="submit"]').should('not.be.disabled').click();
      cy.location('pathname', { timeout: 15000 }).should(
        'not.include',
        '/Login'
      );
      cy.getCookie('accessToken').should('exist');
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookie('accessToken').then((c) => {
          expect(c, 'accessToken 쿠키').to.exist;
          cy.request({
            url: `${Cypress.env('apiUrl')}/api/members/info`,
            headers: {
              Authorization: `Bearer ${decodeURIComponent(c!.value)}`,
            },
            failOnStatusCode: false,
          })
            .its('status')
            .should('eq', 200);
        });
      },
    }
  );
});

// 위치 권한 프롬프트는 브라우저가 띄우면 테스트가 멈춘다. 서울 기본 좌표로 고정.
Cypress.Commands.add(
  'stubGeolocation',
  (latitude = 37.5642135, longitude = 127.0016985) => {
    cy.on('window:before:load', (win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(
        (cb: any) => cb({ coords: { latitude, longitude } })
      );
    });
  }
);

// 서드파티(구글 지도 등) 스크립트 오류로 spec 전체가 실패하지 않게 한다.
Cypress.on('uncaught:exception', (err) => {
  if (/google|maps|ResizeObserver|Hydration|hydrat/i.test(err.message))
    return false;
  return true;
});

declare global {
  namespace Cypress {
    interface Chainable {
      /** 전체 페이지 스크린샷을 cypress/screenshots/<spec>/<name>.png 로 저장 */
      capture(name: string): Chainable<void>;
      /** 녹화 영상 하단에 텍스트 자막을 찍고 Cypress 로그에도 남긴다 */
      step(label: string): Chainable<void>;
      /** QA 테스트 계정으로 로그인 (cy.session 캐시) */
      login(): Chainable<void>;
      /** navigator.geolocation을 고정 좌표로 스텁 */
      stubGeolocation(latitude?: number, longitude?: number): Chainable<void>;
    }
  }
}

export {};
