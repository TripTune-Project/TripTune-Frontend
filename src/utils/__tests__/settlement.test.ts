import {
  encodeSettlement,
  parseSettlement,
  splitAmount,
} from '@/utils/settlement';

const sample = {
  total: 100000,
  people: 3,
  bank: '카카오뱅크',
  account: '3333-01-1234567',
  holder: '임효진',
};

test('보낸 정산 메시지를 그대로 읽어온다', () => {
  expect(parseSettlement(encodeSettlement(sample))).toEqual(sample);
});

test('일반 메시지나 깨진 형식은 정산으로 보지 않는다', () => {
  expect(parseSettlement('안녕하세요')).toBeNull();
  expect(parseSettlement('[[SETTLE]]{broken')).toBeNull();
  expect(
    parseSettlement(encodeSettlement({ ...sample, people: 0 }))
  ).toBeNull();
});

test('1인당 금액은 내림하고 나머지를 따로 계산한다', () => {
  expect(splitAmount(100000, 3)).toEqual({ perPerson: 33333, remainder: 1 });
  expect(splitAmount(120000, 4)).toEqual({ perPerson: 30000, remainder: 0 });
});
