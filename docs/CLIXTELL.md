# 고속티켓 Clixtell 설치

2026-10-27 사용자 요청에 따라 착한티켓에서 검증한 모듈을 적용했다. 이 문서는 고속티켓 프로젝트의 설정을 다룬다.

- 모듈: app/clixtell.tsx의 ClixtellTracking.
- 위치: app/layout.tsx에서 body 첫 자식. 서버 HTML에도 초기화 script → noscript → 본문 순서로 출력한다.
- Next/React가 body 직후 빈 hidden 메타데이터 경계 div를 자동으로 붙일 수 있다. 이 프레임워크 표식 뒤, 모든 실제 화면 내용 앞에 초기화 코드가 있다. 테스트에서도 이 빈 표식만 허용한다.
- 로더: 현재 페이지 프로토콜 + //scripts.clixtell.com/track.js, async=true로 head에 추가.
- JavaScript 비활성 대체 픽셀: //tracker.clixtell.com/track/t.gif. 1px/빈 alt/숨김 처리로 레이아웃에 영향을 주지 않는다.
- 설치 식별자: clixtell-tracking-init(본문 초기화), clixtell-tracking-loader(외부 로더). IIFE로 변수 충돌을 피하고 로더 ID로 중복 삽입을 막는다.
- Next Script beforeInteractive는 head로 이동하므로 이 모듈은 네이티브 inline script로 출력한다.
- 기존 Google Ads 전화/SMS 전환 코드, 라벨, 전화번호와 문의 동작은 수정하지 않았다.

## 확인 방법

1. npm run build
2. node scripts/verify-clixtell.mjs
3. node scripts/test-contact-tracking.mjs
4. 운영 배포 후 node scripts/verify-clixtell.mjs --live
5. 상위 폴더의 node scripts/verify-google-ads.mjs --live --site=고속티켓

검사는 실제 빌드/운영 HTML의 위치·1회 삽입·noscript를 확인하고, 추출한 초기화 코드를 격리 실행해 외부 로더의 URL/async/중복 방지를 검사한다. 공급사 외부 코드를 실행하거나 고객 전환을 생성하지 않는다.

## 설치와 계정 기능의 구분

사용자가 준 track.js는 공식 문서의 Click Fraud Detection & Protection / Click Monitoring 코드다. 통화 추적용 dynamicphones.js는 별도이며 이번 요청의 코드에 포함되지 않아 추가하지 않았다. 통화 추적 번호·계정 연동·차단 규칙 설정이나 대시보드 수집 성공을 설치만으로 완료했다고 표현하지 않는다.

공식 근거: https://support.clixtell.com/how-to-embad-tracking-scripts/

## 배포 기록

전체 사이트별 운영 배포 커밋·검증 결과는 상위 GOOGLE-ADS-ROLLOUT.md의 Clixtell 확장 기록을 따른다.
