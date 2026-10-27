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

## 2026-10-27 문자 전환 누락 보완 · 2026-10-27.2

- 기존 구현은 전환을 큐에 넣고 즉시 sms:/tel: 기본 동작을 허용했다. 외부 앱 전환이 브라우저 처리를 중단하는 조건에서 비동기 전환이 먼저 처리되지 않는 순서 문제를 격리 테스트로 재현했다. 사용자 캡처의 단독 원인이 이것이라고 확정한 것은 아니다.
- 초기화/클릭 리스너는 루트 레이아웃의 beforeInteractive로 등록한다. 외부 Google 스크립트는 afterInteractive로 비동기 로드한다.
- 클릭 시 기본 이동을 잠깐 보류하고 event_callback에서 해당 링크로 이동한다. event_timeout=900ms, 별도 최대 1000ms 타이머와 예외 즉시 연결로 Google 로드 실패 때도 문의 연결을 유지한다.
- 대기 중 같은 버튼의 중복 클릭과 늦게 온 콜백을 방어한다. 상품별 문자 본문과 iOS(&body)/Android(?body)를 보존한다. 기존 전화/SMS 라벨, 번호, 카카오 유지 범위는 그대로다.
- 콜백 호출은 Google 처리 완료 또는 제한 시간 경과일 수 있으므로 Ads 서버 수신/광고 귀속 성공의 증거로 간주하지 않는다.
- 회귀 검사: node scripts/test-contact-tracking.mjs. 공통 운영 검사: 상위 scripts/verify-google-ads.mjs --live. 후자는 각 페이지 실제 HTML의 실행용 초기화 스크립트를 추출해 정본과 일치·콜백/연결 순서를 확인하며 Google 전송은 시뮬레이션한다.
- Google Tag Assistant의 실제 전환 감지 결과와 최신 배포/정리 결과는 상위 GOOGLE-ADS-ROLLOUT.md가 정본이다.
