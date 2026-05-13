# QA Proof Report

생성 시각: 2026-05-13T00:39:25.221Z
실행 결과: 통과
Playwright exit code: 0

## PM/CTO용 요약

이번 PR proof는 핵심 화면을 자동으로 열고 desktop/mobile screenshot과 체크 결과를 남겼습니다. 목적은 반복 화면 확인 시간을 줄이고, 눈에 보이는 화면 회귀 위험을 PR 단계에서 빠르게 확인하는 것입니다.

## 확인 범위

- 홈: PR QA proof 데모 메시지와 CTA 확인
- 가격/비교: 수동 확인 대비 proof 셋업 비교표 확인
- 설정: 고객 repo 적용 체크리스트 확인
- desktop viewport: 1365x768
- mobile viewport: 390x844

## 체크 결과

| 화면 | 뷰포트 | 결과 | 증거 |
| --- | --- | --- | --- |
| 홈 | desktop | 통과 | qa-proof-artifacts/screenshots/home-desktop.png |
| 홈 | mobile | 통과 | qa-proof-artifacts/screenshots/home-mobile.png |
| 가격/비교 | desktop | 통과 | qa-proof-artifacts/screenshots/pricing-desktop.png |
| 가격/비교 | mobile | 통과 | qa-proof-artifacts/screenshots/pricing-mobile.png |
| 설정 | desktop | 통과 | qa-proof-artifacts/screenshots/settings-desktop.png |
| 설정 | mobile | 통과 | qa-proof-artifacts/screenshots/settings-mobile.png |

## 생성된 screenshot

- `qa-proof-artifacts/screenshots/home-desktop.png`
- `qa-proof-artifacts/screenshots/home-mobile.png`
- `qa-proof-artifacts/screenshots/pricing-desktop.png`
- `qa-proof-artifacts/screenshots/pricing-mobile.png`
- `qa-proof-artifacts/screenshots/settings-desktop.png`
- `qa-proof-artifacts/screenshots/settings-mobile.png`

## 실패 artifact

- 이번 실행은 통과 상태라 실패 video/trace가 생성되지 않았습니다. 실패 시 `qa-proof-artifacts/test-results/`에 남습니다.

## 다음 조치

- 통과: PR 댓글에서 screenshot과 체크 결과를 확인하고 리뷰를 진행합니다.
- 확인 필요: artifact의 video/trace를 열어 깨진 화면과 재현 경로를 먼저 확인합니다.
- 적용 확대: 고객 repo에서는 핵심 화면 2~3개부터 고정한 뒤 결제/온보딩처럼 민감한 화면을 추가합니다.
