// ponytail: 정산은 채팅 문자열에 접두어 + JSON으로 실어 보낸다 (백엔드 변경 없음).
// 정산 목록·입금 체크가 필요해지면 그때 전용 API로 옮긴다.
export const SETTLE_PREFIX = '[[SETTLE]]';

export interface Settlement {
  total: number;
  people: number;
  bank: string;
  account: string;
  holder: string;
}

export const encodeSettlement = (s: Settlement): string =>
  SETTLE_PREFIX + JSON.stringify(s);

// 형식이 맞지 않으면 null → 일반 텍스트로 보여준다
export const parseSettlement = (message: string): Settlement | null => {
  if (!message.startsWith(SETTLE_PREFIX)) return null;
  try {
    const s = JSON.parse(message.slice(SETTLE_PREFIX.length));
    const valid =
      Number.isInteger(s.total) &&
      s.total > 0 &&
      Number.isInteger(s.people) &&
      s.people > 0 &&
      typeof s.bank === 'string' &&
      typeof s.account === 'string' &&
      typeof s.holder === 'string';
    return valid
      ? {
          total: s.total,
          people: s.people,
          bank: s.bank,
          account: s.account,
          holder: s.holder,
        }
      : null;
  } catch {
    return null;
  }
};

// 1인당 금액은 원 단위 내림, 남는 금액은 요청자가 부담
export const splitAmount = (total: number, people: number) => {
  const perPerson = Math.floor(total / people);
  return { perPerson, remainder: total - perPerson * people };
};
