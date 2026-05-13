# Live Demo Proof

검증일: 2026-05-13 09:57 KST

이 문서는 로컬 샘플이 아니라 실제 GitHub PR에서 실행된 PR QA proof 증거 패키지다. 포지션은 "QA 전체 대체"가 아니라, PR마다 핵심 화면 확인 proof를 남겨 PM/CTO의 반복 확인 시간을 줄이고 화면 회귀 위험을 빨리 보이게 하는 것이다.

## 실제 링크

- GitHub repo: https://github.com/designinglaunguage/pr-qa-proof-demo-next
- Repo visibility: public
- Demo PR: https://github.com/designinglaunguage/pr-qa-proof-demo-next/pull/1
- PR title: `Update hero copy for QA proof demo`
- 실제 PR 변경: `src/styles.css`의 proof panel padding `16px` -> `18px`
- Actions run: https://github.com/designinglaunguage/pr-qa-proof-demo-next/actions/runs/25771413418
- Actions job: https://github.com/designinglaunguage/pr-qa-proof-demo-next/actions/runs/25771413418/job/75695138829
- Artifact: https://github.com/designinglaunguage/pr-qa-proof-demo-next/actions/runs/25771413418/artifacts/6959287844
- PR comment: https://github.com/designinglaunguage/pr-qa-proof-demo-next/pull/1#issuecomment-4436080307

Private repo 생성은 현재 `gh` HTTPS/PAT 경로에서 권한 scope 문제로 막혔다. SSH push는 성공했고, 이 데모 앱에는 비밀값이 없어 실제 proof 검증은 public repo에서 끝까지 진행했다. 고객 repo 적용 시에는 고객 GitHub 권한으로 private repo 안에 같은 workflow를 붙이는 방식이다.

## CI 검증 결과

- Event: `pull_request`
- Branch: `demo-change`
- Workflow: `PR QA Proof`
- Job: `Generate PR QA proof`
- Conclusion: success
- `npm ci`: success
- `npx playwright install --with-deps chromium`: success
- `npm run build`: success
- `npm run qa:proof`: success, 6 checks passed
- `GITHUB_STEP_SUMMARY`: `qa-proof-artifacts/github-step-summary.md`를 job summary로 기록
- PR comment: `github-actions` 계정이 생성 후 최신 run 결과로 갱신

## Artifact 목록

Artifact name: `qa-proof-1`

```text
check-results.json
github-step-summary.md
playwright-report/index.html
qa-proof-report.md
sample-pr-comment.md
screenshots/home-desktop.png
screenshots/home-mobile.png
screenshots/pricing-desktop.png
screenshots/pricing-mobile.png
screenshots/settings-desktop.png
screenshots/settings-mobile.png
test-results/.last-run.json
```

통과 run이라 실패 video/trace는 생성되지 않았다. 실패 시에는 Playwright 설정에 따라 `test-results/` 아래에 video/trace가 남는다.

## PR 댓글 본문 요약

PR 댓글은 `<!-- qa-proof-demo:summary -->` marker로 생성/갱신된다.

주요 내용:

- 상태: 통과
- 핵심 화면 6개 체크 실행
- 홈 desktop/mobile screenshot 저장
- 가격/비교 desktop/mobile screenshot 저장
- 설정 desktop/mobile screenshot 저장
- 리뷰어 확인 순서 포함

댓글 권한 문제는 이번 같은 repo PR에서는 발생하지 않았다. 만약 고객 환경에서 댓글 권한이 막히면 artifact의 `sample-pr-comment.md`가 동일 본문 대체물이다.

## Screenshot 위치

GitHub artifact `qa-proof-1` 안에서 아래 파일을 열면 된다.

```text
screenshots/home-desktop.png
screenshots/home-mobile.png
screenshots/pricing-desktop.png
screenshots/pricing-mobile.png
screenshots/settings-desktop.png
screenshots/settings-mobile.png
```

검증용으로 다운로드한 로컬 복사본은 아래에 있다.

```text
/tmp/pr-qa-proof-artifact-25771413418/screenshots/
```

## 1분 고객 데모 순서

1. Demo PR을 연다: https://github.com/designinglaunguage/pr-qa-proof-demo-next/pull/1
2. `github-actions` 댓글의 상태와 화면별 체크 표를 보여준다.
3. Actions run을 열고 `Generate PR QA proof`가 성공한 것을 보여준다.
4. Artifact `qa-proof-1`을 열어 `qa-proof-report.md`와 `sample-pr-comment.md`가 같이 남는 것을 보여준다.
5. `screenshots/`의 desktop/mobile 6장을 보여준다.
6. 마지막에 `.github/workflows/pr-qa-proof.yml`을 보여주며 고객 repo에는 workflow, Playwright test, report generator만 작게 붙인다고 설명한다.

## 남은 리스크

- GitHub Actions의 Node.js 20 기반 action deprecation warning이 있다. 현재 run은 성공했지만 2026년 GitHub runner 변경 전에 action major version 또는 runner env를 다시 확인해야 한다.
- 현재 MVP는 Chromium 한 브라우저와 핵심 화면 3개만 본다. 결제, 권한, 전체 회귀 승인으로 설명하면 안 된다.
- Public repo로 검증했다. 고객 적용 시 private repo에서는 repo 설정의 Actions 권한과 PR comment 권한을 확인해야 한다.
