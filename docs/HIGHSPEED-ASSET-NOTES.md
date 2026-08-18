# 고속티켓 브랜드 에셋 제작 기록

## 히어로 캐릭터

- 제작 방식: 내장 ImageGen의 기존 이미지 정밀 편집
- 편집 대상: 착한티켓 `public/assets/common/hero-phone-brand.png`
- 생성 원본: `assets/_source/highspeed-hero-imagegen-v1.png`
- 최종 파일: `public/assets/common/highspeed-hero-v1.png`
- 최종 규격: 398×422 PNG
- 유지 항목: 휴대폰 구도, 상품권 로고, 해시태그, 화분, 화면 비율
- 변경 항목: 각진 얼굴, 짧은 옆가르마, 로열블루 재킷, 라임 포인트, 짧은 속도선

### 최종 프롬프트

```text
Use case: precise-object-edit
Asset type: transparent-background landing-page hero illustration, exact canvas and composition preserved
Input image: edit target and composition anchor
Primary request: Change only the male character standing on the left into the 고속티켓 brand character: a friendly young Korean man with a slightly more angular face, short neat dark hair with a clean side part, confident warm smile, bright royal-blue casual jacket over a white shirt, and one small lime-green accent on his shoe or phone case. Keep his pose, body scale, position, hand placement, and the clean flat vector illustration style nearly identical. Add only two or three very subtle short blue motion-line accents near the character’s outer left side, not touching the phone.
Color palette: royal blue #1D4ED8, deep navy #172554, pale blue #DBEAFE, tiny lime #A3E635 accent, cyan #7DD3FC.
Hard invariants: preserve the entire smartphone, all screen graphics, every Korean and English character, CULTURE LAND and 신세계 logos, both blue hashtag labels, phone proportions, plant composition, transparent background, canvas aspect ratio, and every non-character pixel as closely as possible. Do not add or remove any other objects. Do not generate new text. No watermark. Output with a genuinely transparent background.
```

## 재색상 자동화

- `node scripts/recolor-brand-assets.mjs`: 기준 HOW·WHY 에셋을 고속티켓 블루 톤으로 생성한다.
- `node scripts/remove-checkerboard-background.mjs`: 생성 원본의 바깥 체크무늬를 연결 영역 기준으로 제거하고 398×422 알파 PNG로 만든다.

## 정확한 글자 처리

로고와 네이버 검색 배너의 한글은 생성형 이미지에 맡기지 않고 SVG 텍스트로 작성했다. 페이지 본문은 로컬 Pretendard Variable을 사용한다.
