<!-- qa-proof-demo:summary -->
## PR QA Proof Summary

상태: 통과

### PM/CTO용 요약

핵심 화면 6개 체크가 실행되었습니다. 이 proof는 반복 화면 확인 시간을 줄이고 PR 단계에서 화면 회귀 위험을 빨리 보이게 하기 위한 자동 증거입니다.

| 화면 | 뷰포트 | 결과 | 증거 |
| --- | --- | --- | --- |
| 홈 | desktop | 통과 | qa-proof-artifacts/screenshots/home-desktop.png |
| 홈 | mobile | 통과 | qa-proof-artifacts/screenshots/home-mobile.png |
| 가격/비교 | desktop | 통과 | qa-proof-artifacts/screenshots/pricing-desktop.png |
| 가격/비교 | mobile | 통과 | qa-proof-artifacts/screenshots/pricing-mobile.png |
| 설정 | desktop | 통과 | qa-proof-artifacts/screenshots/settings-desktop.png |
| 설정 | mobile | 통과 | qa-proof-artifacts/screenshots/settings-mobile.png |

### 생성 파일

- `qa-proof-artifacts/qa-proof-report.md`
- `qa-proof-artifacts/sample-pr-comment.md`
- `qa-proof-artifacts/screenshots/`
- `qa-proof-artifacts/test-results/` 실패 시 video/trace 저장

### 리뷰어 확인 순서

1. 위 표에서 실패 또는 확인 필요 항목을 먼저 본다.
2. screenshot artifact에서 desktop/mobile 화면을 확인한다.
3. 실패가 있으면 video/trace artifact로 재현 경로를 본다.
