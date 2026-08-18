# 고속티켓 에셋 교체 지도

전체 에셋 경로는 `app/asset-registry.ts` 한 곳에서 관리한다.

## 고속티켓 전용 에셋

- `public/assets/brand/highspeed-ticket-mark.svg`: 속도선과 티켓 심볼
- `public/assets/brand/highspeed-ticket-search.svg`: 네이버 검색 배너
- `public/assets/brand/highspeed-ticket-kakao-qr.png`: 실제 카카오 링크 QR
- `public/assets/common/highspeed-hero-v1.png`: 블루 재킷 캐릭터 히어로, 398×422
- `public/assets/common/process-steps-highspeed.png`: 고속티켓 블루 톤 HOW 이미지
- `public/assets/icons/why-*-highspeed.png`: 고속티켓 블루 톤 WHY 아이콘 4종

## 승인된 공통 에셋

- `public/assets/products/*`: 상품권 실물 이미지 6종
- `public/assets/icons/call-white.png`
- `public/assets/icons/kakao-dark.png`
- `public/assets/icons/kakao-white.png`
- `public/assets/icons/top.png`
- `public/assets/fonts/PretendardVariable.woff2`

## 교체 방법

1. 같은 역할의 새 파일을 `public/assets` 아래에 저장한다.
2. 파일명이 달라지면 `app/asset-registry.ts`의 `src`만 수정한다.
3. 브랜드 정보는 `app/site-config.ts` 한 곳에서 수정한다.
4. `npm run lint`, `npm run build`, 데스크톱 1440px·모바일 390px 검수를 수행한다.

카카오 주소는 `app/site-config.ts`의 `kakaoUrl`에만 기록한다.
현재 공식 링크는 `https://open.kakao.com/o/sireupJi`다.
