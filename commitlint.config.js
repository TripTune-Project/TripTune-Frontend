/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새 기능
        'fix', // 버그 수정
        'docs', // 문서
        'style', // 포맷/세미콜론 등 (로직 변경 X)
        'refactor', // 리팩토링 (기능/버그 변경 X)
        'perf', // 성능 개선
        'test', // 테스트 추가/수정
        'build', // 빌드 시스템, 의존성
        'ci', // CI 설정
        'chore', // 그 외 잡일
        'revert', // 되돌리기
      ],
    ],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
