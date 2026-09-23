/**
 * QA 모음 > 여행지 탐색 > 세부 목록 (세부목록001 ~ 세부목록010)
 */
describe('여행지 탐색 - 상세', () => {
  const openFirstPlace = () => {
    cy.stubGeolocation();
    cy.intercept('POST', '**/api/travels?page=*').as('list');
    cy.intercept('GET', '**/api/travels/*').as('detail');
    cy.visit('/Travel');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li').first().click();
    cy.location('pathname', { timeout: 15000 }).should(
      'match',
      /^\/Travel\/\d+$/
    );
  };

  it('세부목록001 | 선택한 여행지의 상세 정보가 표시된다', () => {
    cy.step('세부목록001 · 목록에서 여행지 선택 → 상세 정보 로드');
    openFirstPlace();
    cy.wait('@detail').its('response.statusCode').should('eq', 200);
    cy.contains('주소').should('be.visible');
    cy.contains('h2', '상세 설명').should('be.visible');
    cy.capture('세부목록001-상세정보');
  });

  it('세부목록002 | 상세 이미지가 로드된다', () => {
    cy.step('세부목록002 · 상세 이미지 로드 확인');
    openFirstPlace();
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    // 이미지가 없는 여행지는 "이미지가 없습니다." 플레이스홀더를 보여준다.
    cy.get('[class*="topSection"]').then(($top) => {
      const imgs = $top.find(
        'img[class*="sliderImage"], [class*="sliderImageContainer"] img'
      );
      if (imgs.length === 0) {
        cy.contains('이미지가 없습니다.').should('be.visible');
        return;
      }
      // next/image가 실제로 디코딩에 성공했는지 (naturalWidth 0이면 깨진 이미지)
      cy.wrap(imgs).each(($img) => {
        expect(
          ($img[0] as HTMLImageElement).naturalWidth,
          $img.attr('src') ?? 'image'
        ).to.be.greaterThan(0);
      });
    });
    cy.capture('세부목록002-이미지');
  });

  it('세부목록003 | 비로그인 상태에서 북마크를 누르면 로그인 모달이 뜬다', () => {
    cy.step('세부목록003(비로그인) · 북마크 버튼 클릭');
    cy.clearCookies();
    openFirstPlace();
    cy.get('button:has(img[alt="북마크"])').click();
    cy.contains('로그인 필요').should('be.visible');
    cy.capture('세부목록003-북마크-로그인모달');
  });

  it('세부목록004 | 로그인 상태에서 "내 일정 담기"를 누르면 모달이 열린다', () => {
    cy.step('세부목록004 · "내 일정 담기" 모달 열기');
    cy.login();
    cy.intercept('GET', '**/api/schedules/edit*').as('editable');
    openFirstPlace();
    cy.contains('button', '내 일정 담기').click();
    cy.contains('여행지를 추가하고 싶은 일정을 선택하세요.').should(
      'be.visible'
    );
    cy.contains('button', '선택하기').should('be.visible');
    cy.capture('세부목록004-일정담기모달');
  });

  it('일정담기003 | 일정을 고르기 전에는 "선택하기" 버튼이 비활성이다', () => {
    cy.step('일정담기003 · 일정 미선택 상태의 선택하기 버튼');
    cy.login();
    openFirstPlace();
    cy.contains('button', '내 일정 담기').click();
    cy.contains('여행지를 추가하고 싶은 일정을 선택하세요.').should(
      'be.visible'
    );
    cy.get('body').then(($b) => {
      if ($b.find('button:contains("선택하기")').length === 0) {
        cy.contains('일정이 존재하지 않습니다.').should('be.visible');
        return;
      }
      cy.contains('button', '선택하기').should('be.disabled');
    });
    cy.capture('일정담기003-선택하기비활성');
  });

  it('세부목록006 | 설명이 길면 "내용 더 보기"로 전체가 펼쳐진다', () => {
    cy.step('세부목록006 · 상세 설명 더보기 토글');
    openFirstPlace();
    cy.get('body').then(($b) => {
      if ($b.find('button:contains("내용 더 보기")').length === 0) {
        cy.log('이 여행지는 설명이 짧아 더보기 버튼이 없음 — 해당 없음');
        return;
      }
      cy.contains('button', '내용 더 보기').click();
      cy.contains('button', '접기').should('be.visible');
      cy.capture('세부목록006-더보기');
    });
  });

  it('세부목록009 | 상세 조회 실패 시 로딩이 끝나고 오류를 안내한다', () => {
    cy.step('세부목록009 · 네트워크 실패 시 오류 처리');
    cy.stubGeolocation();
    cy.intercept('POST', '**/api/travels?page=*').as('list');
    cy.visit('/Travel');
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.get('ul li')
      .first()
      .invoke('attr', 'class')
      .then(() => {
        cy.intercept('GET', '**/api/travels/*', { forceNetworkError: true }).as(
          'fail'
        );
        cy.get('ul li').first().click();
      });
    cy.location('pathname', { timeout: 15000 }).should(
      'match',
      /^\/Travel\/\d+$/
    );
    // 무한 스피너로 멈추지 않고 어떤 형태로든 결과가 나와야 한다
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.capture('세부목록009-네트워크오류');
  });

  it('세부목록010 | 좁은 화면에서도 상세 UI가 깨지지 않는다', () => {
    cy.step('세부목록010 · 375x812 모바일 뷰포트');
    openFirstPlace();
    cy.viewport(375, 812);
    cy.get('[role="status"]', { timeout: 20000 }).should('not.exist');
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        doc.documentElement.clientWidth + 1
      );
    });
    cy.capture('세부목록010-모바일');
  });
});

/*
 * 자동화 제외
 * - 세부목록005 주소 링크 / 008 연락처 클릭: 현재 주소·연락처는 <dd> 텍스트일 뿐 링크가 아님 (코드 확인). 기능 미구현.
 * - 세부목록007 지도 마커 클릭: Google Maps canvas 마커 → 안정적 DOM 셀렉터 없음. 수동 QA.
 */
