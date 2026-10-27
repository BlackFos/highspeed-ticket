# Google Ads 전화 문자 문의 관리

- 기본 태그 및 전환라벨: `content/tracking.json`.
- 번호와 문자 기본 문구: `app/site-config.ts` (세이프뱅크는 `content/site.json`).
- 문의 링크 규칙: `app/contact-utils.ts`; 클릭 추적 및 iOS 문자 호환: `app/tracking-script.ts`.
- 전체 페이지 적용: `app/layout.tsx` → `GoogleAds`.
- `data-contact-channel`은 phone/sms, `data-contact-placement`는 버튼의 배치 역할이다.
- 기본 태그: AW-18538035442. 실제 Google Ads에서 발급한 라벨만 입력한다.
- 전화/문자 라벨이 빈 문자열이면 전환 이벤트를 전송하지 않는다. 기본 태그와 상담 링크는 정상 작동한다.
- 전화 클릭은 통화 완료가 아니며 문자 클릭은 전송 완료가 아니다.
- 추적 실패 시에도 기본 링크 동작은 유지한다. 문자 본문은 Google Ads 이벤트에 전달하지 않는다.
- 번호·문구·라벨 변경 후 빌드 및 운영 재배포가 필요하다.
- 공통 진행 계획: 상위 폴더 `GOOGLE-ADS-ROLLOUT.md`.

## 검증

`node scripts/test-contact-tracking.mjs`로 실제 생성 스크립트를 격리 실행해 전화/문자 분리,
빈 라벨, 중복 설치, iOS/Android 문자 본문, 오류 시 기본 동작을 확인한다.

## 현재 적용 범위 (2026-10-27)

기존 카카오 문의를 바로 문의하기 → 해당 브랜드 번호의 SMS로 변경했다. 전화 버튼은 유지한다.

- 광고주 계정 755-549-1103, 태그 AW-18538035442에서 전화 문의 클릭 (웹사이트) / 문자 문의 클릭 (웹사이트)을 생성했다.
- 전화 라벨 `1_EgCJXcg6sdEPLxz4dF`, 문자 라벨 `fiqXCJjcg6sdEPLxz4dF`.
- 카테고리 문의, 횟수 1회, 금전 가치 0원, 향상된 전환 사용 안 함. 문의 내용·개인 정보를 이벤트에 보내지 않는다.
- 새 액션 생성 후 Google 요약 화면에서 문의가 계정 기본 목표로 표시되었다(기본 액션 2개). 캠페인·예산·입찰 설정 화면은 변경하지 않았다. 액션별 보고서에서 전화/문자를 구분한다.
