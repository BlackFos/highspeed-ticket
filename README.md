# 고속티켓

착한티켓 골든 마스터의 구조와 반응형 규격을 유지하면서 고속티켓 전용 블루·라임 팔레트와 에셋으로 재구현한 Next.js 랜딩페이지다.

## 로컬 실행

```powershell
npm install
npm run dev
```

## 핵심 관리 파일

- `app/site-config.ts`: 고속티켓 브랜드명, 도메인, 전화, 카카오, 색상
- `app/asset-registry.ts`: 전체 이미지 에셋 인덱스
- `app/page.tsx`: 고정 섹션 구조
- `app/globals.css`: 보라티켓 계열 반응형 규격
- `docs/ASSET-MAP.md`: 에셋 교체 절차

## 섹션 순서

헤더 → 히어로 → 전화/카카오 카드 → 진행현황 → WHY → HOW → 취급상품 → 푸터 → 플로팅/모바일 고정 상담.
