/**
 * 이미지 최적화 스크립트
 * PNG/JPG 이미지를 WebP로 변환하여 용량 절감
 *
 * 실행: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 최적화할 주요 이미지 목록 (메인 페이지 우선)
const mainImages = [
  {
    input: 'public/assets/images/메인화면/ocean_title.png',
    output: 'public/assets/images/메인화면/ocean_title.webp',
    quality: 85,
    priority: 'high' // LCP 이미지
  },
  {
    input: 'public/assets/images/메인화면/scheduleIcon.png',
    output: 'public/assets/images/메인화면/scheduleIcon.webp',
    quality: 90,
    priority: 'medium'
  },
  {
    input: 'public/assets/images/메인화면/selectScheduleIcon.png',
    output: 'public/assets/images/메인화면/selectScheduleIcon.webp',
    quality: 90,
    priority: 'medium'
  },
  {
    input: 'public/assets/images/메인화면/travelIcon.png',
    output: 'public/assets/images/메인화면/travelIcon.webp',
    quality: 90,
    priority: 'medium'
  },
  {
    input: 'public/assets/images/메인화면/selectTravelIcon.png',
    output: 'public/assets/images/메인화면/selectTravelIcon.webp',
    quality: 90,
    priority: 'medium'
  },
  {
    input: 'public/assets/images/메인화면/ocean.jpg',
    output: 'public/assets/images/메인화면/ocean.webp',
    quality: 85,
    priority: 'medium'
  },
  {
    input: 'public/assets/images/메인화면/광화문.jpg',
    output: 'public/assets/images/메인화면/광화문.webp',
    quality: 85,
    priority: 'low'
  },
  {
    input: 'public/assets/images/메인화면/성산일출봉.jpg',
    output: 'public/assets/images/메인화면/성산일출봉.webp',
    quality: 85,
    priority: 'low'
  },
  {
    input: 'public/assets/images/메인화면/에펠탑.jpg',
    output: 'public/assets/images/메인화면/에펠탑.webp',
    quality: 85,
    priority: 'low'
  },
  {
    input: 'public/assets/images/메인화면/타워브릿지.jpg',
    output: 'public/assets/images/메인화면/타워브릿지.webp',
    quality: 85,
    priority: 'low'
  },
  {
    input: 'public/assets/images/로고/triptuneLogoWhite.png',
    output: 'public/assets/images/로고/triptuneLogoWhite.webp',
    quality: 90,
    priority: 'medium' // Footer에서 priority 사용
  }
];

// 이미지 최적화 함수
async function optimizeImage(imageConfig) {
  const { input, output, quality, priority } = imageConfig;

  try {
    // 입력 파일 존재 확인
    if (!fs.existsSync(input)) {
      console.log(`⚠️  [SKIP] ${input} - 파일을 찾을 수 없습니다.`);
      return;
    }

    // 이미 WebP 파일이 존재하는지 확인
    if (fs.existsSync(output)) {
      console.log(`⚠️  [SKIP] ${output} - 이미 존재합니다. (덮어쓰려면 파일을 삭제하세요)`);
      return;
    }

    // 원본 파일 크기
    const originalStats = fs.statSync(input);
    const originalSize = (originalStats.size / 1024).toFixed(2);

    // WebP로 변환
    await sharp(input)
      .webp({ quality })
      .toFile(output);

    // 변환된 파일 크기
    const optimizedStats = fs.statSync(output);
    const optimizedSize = (optimizedStats.size / 1024).toFixed(2);
    const reduction = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

    console.log(
      `✅ [${priority.toUpperCase()}] ${path.basename(output)}\n` +
      `   원본: ${originalSize} KB → WebP: ${optimizedSize} KB (${reduction}% 감소)`
    );
  } catch (error) {
    console.error(`❌ [ERROR] ${input} 변환 실패:`, error.message);
  }
}

// 메인 실행 함수
async function main() {
  console.log('🚀 이미지 최적화 시작...\n');

  // scripts 디렉토리가 없으면 생성
  const scriptsDir = path.dirname(__filename);
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // 우선순위별로 정렬 (high > medium > low)
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedImages = [...mainImages].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;

  // 순차적으로 이미지 최적화
  for (const imageConfig of sortedImages) {
    await optimizeImage(imageConfig);

    // 통계 계산 (성공한 경우만)
    if (fs.existsSync(imageConfig.output) && fs.existsSync(imageConfig.input)) {
      const originalSize = fs.statSync(imageConfig.input).size;
      const optimizedSize = fs.statSync(imageConfig.output).size;
      totalOriginalSize += originalSize;
      totalOptimizedSize += optimizedSize;
      successCount++;
    }
  }

  console.log('\n📊 최적화 결과 요약');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`처리된 이미지: ${successCount}개`);
  console.log(`원본 총 크기: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`최적화 후 크기: ${(totalOptimizedSize / 1024).toFixed(2)} KB`);
  console.log(`총 절감량: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(2)} KB`);
  console.log(`절감률: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log('\n✨ 최적화 완료!');
  console.log('\n다음 단계:');
  console.log('1. src/app/page.tsx에서 ocean_title.png → ocean_title.webp로 import 변경');
  console.log('2. src/app/layout.tsx에서 triptuneLogoWhite.png → triptuneLogoWhite.webp로 import 변경');
  console.log('3. 다른 컴포넌트에서도 필요시 .webp 파일 사용');
}

// 실행
main().catch(console.error);
