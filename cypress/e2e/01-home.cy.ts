/**
 * QA 모음 > 홈 (메인001 ~ 메인010)
 * 출처: Notion "문서 > QA 모음 > 홈"
 */
describe('홈 (메인)', () => {
  const SEARCH = 'input[placeholder="원하는 여행지를 검색해보세요."]';
  const SEARCH_BTN = 'button:has(img[alt="돋보기 아이콘"])';

  beforeEach(() => {
    cy.intercept('GET', '**/api/travels/popular*').as('popular');
    cy.intercept('GET', '**/api/travels/recommend*').as('recommend');
    cy.visit('/');
  });

  it('메인008 | 화면 로드 시 인기·추천 여행지 데이터가 표시된다', () => {
    cy.step('메인008 · 초기 로드 시 인기/추천 여행지 데이터 표시');
    cy.wait(['@popular', '@recommend']).each((i: any) => {
      expect(i.response.statusCode).to.eq(200);
    });
    cy.contains('h2', '인기 여행지').should('be.visible');
    cy.contains('추천 여행 테마').should('be.visible');
    cy.get('.swiper-slide').should('have.length.greaterThan', 0);
    cy.capture('메인008-초기로드');
  });

  it('메인001 | 유효한 검색어 입력 후 여행지 목록으로 이동한다', () => {
    cy.step('메인001 · 검색어 "숙박" 입력 후 검색');
    cy.get(SEARCH).type('숙박');
    cy.get(SEARCH_BTN).click();
    cy.location('pathname').should('eq', '/Travel');
    cy.location('search').should('include', encodeURIComponent('숙박'));
    cy.get('input[placeholder="원하는 여행지를 검색하세요."]').should(
      'have.value',
      '숙박'
    );
    cy.capture('메인001-검색이동');
  });

  it('메인002 | 결과 없는 검색어는 "검색 결과가 없습니다"를 보여준다', () => {
    cy.step('메인002 · 무의미한 검색어 입력 → 결과 없음 안내');
    cy.get(SEARCH).type('ㅁㄴㅇㄹㅁㄴㅇㄹ존재하지않는여행지');
    cy.get(SEARCH_BTN).click();
    cy.location('pathname').should('eq', '/Travel');
    cy.contains('검색 결과가 없습니다.', { timeout: 20000 }).should(
      'be.visible'
    );
    cy.capture('메인002-결과없음');
  });

  it('메인003 | 빈 검색어로 검색 시 "검색어를 입력해주세요" 안내가 떠야 한다', () => {
    cy.step('메인003 · 빈 검색어로 검색 버튼 클릭');
    cy.get(SEARCH).should('have.value', '');
    cy.get(SEARCH_BTN).click();
    // QA 기대값: 안내 메시지 표시. (HomePageSearch.handleSearch는 현재 조용히 return)
    cy.contains('검색어를 입력해주세요').should('be.visible');
  });

  it('메인004 | 인기 여행지 카드 클릭 시 상세 페이지로 이동한다', () => {
    cy.step('메인004 · 인기 여행지 카드 클릭 → 상세 페이지');
    cy.wait('@popular');
    cy.get('.swiper-slide:visible').first().click();
    cy.location('pathname', { timeout: 15000 }).should(
      'match',
      /^\/Travel\/\d+$/
    );
    cy.capture('메인004-상세이동');
  });

  it('메인005 | 캐러셀 화살표로 다음/이전 항목이 이동한다', () => {
    cy.step('메인005 · 인기 여행지 캐러셀 화살표 동작');
    // 인기/추천 섹션은 dynamic import다. 인기만 먼저 뜬 상태에서 화살표를 누르면
    // 뒤늦게 마운트된 추천 섹션 때문에 Swiper가 재초기화되며 첫 클릭이 씹힌다.
    cy.wait(['@popular', '@recommend']);
    cy.get('.swiper-initialized').should('have.length', 2);

    const activeIndex = () =>
      cy
        .get('.swiper-slide-active')
        .first()
        .invoke('attr', 'data-swiper-slide-index');

    // 재초기화 경합을 흡수하기 위해 목표 인덱스에 닿을 때까지 최대 5번 누른다.
    const clickUntil = (arrow: string, expected: string, left = 5) => {
      activeIndex().then((current) => {
        if (current === expected) return;
        if (left === 0) {
          throw new Error(
            `${arrow} 를 눌러도 활성 슬라이드가 ${expected}이 되지 않음 (현재 ${current})`
          );
        }
        cy.get(arrow).should('be.visible').click();
        cy.wait(500); // 전환 300ms
        clickUntil(arrow, expected, left - 1);
      });
    };

    activeIndex().should('eq', '0');
    clickUntil('.popular-swiper-button-next', '1');
    clickUntil('.popular-swiper-button-prev', '0');
  });

  it('메인006 | "일정 만들기" 카드 클릭 시 일정 페이지로 이동한다', () => {
    cy.step('메인006 · "일정을 직접 만들고" 카드 클릭');
    cy.contains('일정 만들기').click();
    cy.location('pathname').should('eq', '/Schedule');
    cy.capture('메인006-일정페이지');
  });

  it('메인009 | 좁은 화면에서도 레이아웃이 깨지지 않는다', () => {
    cy.step('메인009 · 375x812 모바일 뷰포트 반응형 확인');
    cy.viewport(375, 812);
    cy.wait(['@popular', '@recommend']);
    cy.get('header').should('be.visible');
    cy.get(SEARCH).should('be.visible');
    // 가로 스크롤이 생기면 레이아웃이 넘친 것
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        doc.documentElement.clientWidth + 1
      );
    });
    cy.capture('메인009-모바일');
  });

  it('메인010 | 푸터의 이메일·GitHub 정보로 이동할 수 있다', () => {
    cy.step('메인010 · 푸터 이메일/GitHub 링크');
    cy.get('footer').scrollIntoView().should('be.visible');
    cy.get('footer')
      .find('a[href="https://github.com/TripTune-Project"]')
      .should('exist');
    // QA 기대값: 이메일도 클릭으로 연결되어야 한다 → 현재는 mailto 링크가 아닌 평문
    cy.get('footer').find('a[href^="mailto:"]').should('exist');
    cy.capture('메인010-푸터');
    // GitHub 링크 클릭은 github.com으로 이탈해 Cypress 세션이 끊기므로 href 확인까지만 한다.
  });

  it('스크롤 | window.scrollTo가 동작한다 (body가 스크롤 컨테이너가 아님)', () => {
    cy.step('회귀 · window 스크롤 동작 확인');
    cy.window().then((win) => win.scrollTo(0, 500));
    cy.window().its('scrollY').should('be.gt', 0);
    cy.window().then((win) => win.scrollTo(0, 0));
    cy.window().its('scrollY').should('eq', 0);
  });
});

/*
 * 자동화 제외 (기능 미구현 — 코드 확인 결과)
 * - 메인007 "추천 여행지 더보기" 버튼: HomePageRecommendTravel에 더보기 버튼이 없음.
 */
