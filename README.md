# 고속티켓

## 검색 등록 · 2026-10-06

- Search Console의 해당 도메인 속성에 제출할 주소: https://xn--299a350b00j9wd.com/sitemap.xml
- 현재 공개 페이지는 홈 1개이며, 화면 안의 섹션은 별도 URL로 등록하지 않는다.
- `app/sitemap.ts`: 실제 페이지 목록. 새 페이지가 생기면 여기에도 추가한다.
- `app/robots.ts`: 크롤링 허용과 사이트맵 주소. 대표 도메인은 `app/site-config.ts`를 공통으로 사용한다.
- 제출 시 홈페이지 주소 대신 위 XML 주소 전체를 입력한다. 사이트맵 처리 성공과 실제 검색 색인·순위는 별개다.
- 운영 반영 완료: 소스 `16731bd`, Vercel `dpl_GRiWU5nmdG51qCVPJYhQsoc7jtYz` READY. 실제 도메인의 sitemap.xml HTTP 200/application/xml, robots.txt 200, 홈 200·자기 주소 canonical·noindex 없음, 미존재 경로 404를 확인했다. 로컬 빌드·ESLint도 통과했다. Search Console 계정 내 제출은 사용자가 진행한다.

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

## 연락처 변경 기준

2026-09-09 사용자 확정: **고속티켓 010-3971-3389**, 세이프뱅크 010-2194-4939. 9월 8일의 이전 배정을 대체한다. 고속티켓 번호는 `app/site-config.ts`의 `phoneDisplay`에서 수정하며, 전화 연결 주소는 같은 값에서 생성한다. 푸터·전화 카드·플로팅·모바일 상담에 공통 적용된다.

## 섹션 순서

헤더 → 히어로 → 전화/카카오 카드 → 진행현황 → WHY → HOW → 취급상품 → 푸터 → 플로팅/모바일 고정 상담.
