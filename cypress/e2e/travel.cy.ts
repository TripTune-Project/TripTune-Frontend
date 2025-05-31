describe('여행 관리 기능', () => {
  beforeEach(() => {
    // 로그인
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // 여행 페이지로 이동
    cy.visit('/travel');
  });

  it('여행 목록이 정상적으로 표시된다', () => {
    // 여행 목록 로딩 확인
    cy.get('[data-testid="travel-list"]').should('be.visible');
    cy.get('[data-testid="travel-item"]').should('have.length.at.least', 1);
  });

  it('새 여행을 추가할 수 있다', () => {
    // 새 여행 추가 버튼 클릭
    cy.get('[data-testid="add-travel-button"]').click();

    // 여행 정보 입력
    cy.get('input[name="title"]').type('제주도 여행');
    cy.get('input[name="location"]').type('제주시');
    cy.get('input[name="startDate"]').type('2024-03-01');
    cy.get('input[name="endDate"]').type('2024-03-03');
    cy.get('select[name="status"]').select('PLANNED');

    // 저장 버튼 클릭
    cy.get('button[type="submit"]').click();

    // 추가된 여행 확인
    cy.get('[data-testid="travel-item"]')
      .should('contain', '제주도 여행')
      .and('contain', '제주시');
  });

  it('여행을 수정할 수 있다', () => {
    // 첫 번째 여행의 수정 버튼 클릭
    cy.get('[data-testid="travel-item"]').first().find('[data-testid="edit-button"]').click();

    // 여행 정보 수정
    cy.get('input[name="title"]').clear().type('수정된 여행');
    cy.get('input[name="location"]').clear().type('수정된 장소');

    // 저장 버튼 클릭
    cy.get('button[type="submit"]').click();

    // 수정된 여행 확인
    cy.get('[data-testid="travel-item"]')
      .should('contain', '수정된 여행')
      .and('contain', '수정된 장소');
  });

  it('여행을 삭제할 수 있다', () => {
    // 첫 번째 여행의 삭제 버튼 클릭
    cy.get('[data-testid="travel-item"]').first().find('[data-testid="delete-button"]').click();

    // 확인 모달에서 확인 버튼 클릭
    cy.get('[data-testid="confirm-delete"]').click();

    // 삭제된 여행이 목록에서 제거되었는지 확인
    cy.get('[data-testid="travel-item"]').should('not.contain', '수정된 여행');
  });

  it('여행을 필터링할 수 있다', () => {
    // 필터 입력
    cy.get('[data-testid="travel-filter"]').type('제주');

    // 필터링된 결과 확인
    cy.get('[data-testid="travel-item"]').should('contain', '제주');
  });

  it('여행 상태를 변경할 수 있다', () => {
    // 첫 번째 여행의 상태 변경 버튼 클릭
    cy.get('[data-testid="travel-item"]').first().find('[data-testid="status-button"]').click();

    // 상태 변경 확인
    cy.get('[data-testid="travel-item"]').first().should('contain', '진행 중');
  });

  it('여행 상세 정보를 볼 수 있다', () => {
    // 첫 번째 여행 클릭
    cy.get('[data-testid="travel-item"]').first().click();

    // 상세 정보 확인
    cy.get('[data-testid="travel-detail"]').should('be.visible');
    cy.get('[data-testid="travel-detail"]').should('contain', '여행 정보');
  });

  it('여행 일정을 추가할 수 있다', () => {
    // 여행 상세 페이지로 이동
    cy.get('[data-testid="travel-item"]').first().click();

    // 일정 추가 버튼 클릭
    cy.get('[data-testid="add-schedule-button"]').click();

    // 일정 정보 입력
    cy.get('input[name="title"]').type('첫 번째 일정');
    cy.get('input[name="date"]').type('2024-03-01');
    cy.get('input[name="time"]').type('10:00');
    cy.get('textarea[name="description"]').type('일정 설명');

    // 저장 버튼 클릭
    cy.get('button[type="submit"]').click();

    // 추가된 일정 확인
    cy.get('[data-testid="schedule-item"]').should('contain', '첫 번째 일정');
  });
}); 