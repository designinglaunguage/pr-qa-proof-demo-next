# PR QA Proof Demo

작은 웹앱 PR에 GitHub Actions + Playwright QA proof를 붙이는 고객 데모 repo입니다.

고객에게 보여줄 핵심은 PR을 올렸을 때 핵심 화면 스크린샷, 실패 시 영상/trace, 체크리스트, Markdown 리포트, PR 댓글 본문이 자동으로 남는다는 점입니다. 이 데모는 PM/CTO의 반복 화면 확인 시간을 줄이고 화면 회귀 위험을 PR 단계에서 빨리 보이게 하는 proof에 집중합니다.

## 누가 쓰나

- 작은 SaaS/웹앱 팀의 CTO, PM, 테크리드
- 전담 QA 팀은 없지만 PR마다 홈, 가격, 온보딩, 설정 같은 핵심 화면을 반복 확인하는 팀
- 코드 리뷰만으로 화면 변화가 늦게 보이는 팀
- 대형 QA 플랫폼보다 GitHub Actions 안에서 작게 시작하고 싶은 팀

맞지 않는 경우:

- 결제, 권한, 보안까지 전체 QA 승인을 맡기려는 팀
- 여러 브라우저와 픽셀 baseline까지 처음부터 필요한 팀
- GitHub Actions artifact나 PR 댓글을 쓰지 않는 개발 흐름

## 화면

- 홈: PR 댓글 proof가 무엇인지 30초 안에 이해하는 화면
- 가격/비교: 수동 화면 확인과 PR QA proof 셋업 비교
- 설정: 고객 repo에 붙일 때 선택할 체크 범위

로그인, 결제, 외부 API, DB 없이 로컬에서 동작합니다.

## 실행

```bash
npm install
npm run build
npm run start -- --port 4173
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## QA Proof 생성

```bash
npm install
npx playwright install chromium
npm run build
npm run qa:proof
```

생성 결과:

```text
qa-proof-artifacts/
  qa-proof-report.md
  sample-pr-comment.md
  screenshots/
  test-results/
```

`qa-proof-report.md`는 PM/CTO용 요약, 확인 화면, 체크리스트, 다음 조치를 담습니다. `sample-pr-comment.md`는 GitHub PR 댓글에 그대로 들어갈 본문입니다.

repo에 보존된 샘플 proof는 `docs/sample-proof/`에서도 확인할 수 있습니다.

## GitHub Actions

`.github/workflows/pr-qa-proof.yml`은 `pull_request`에서 실행됩니다.

흐름:

1. `npm ci`
2. Chromium 설치
3. 앱 build
4. Playwright QA proof 실행
5. screenshot/report/video/trace artifact 업로드
6. `GITHUB_STEP_SUMMARY` 작성
7. PR 댓글 생성 또는 기존 QA proof 댓글 갱신

로컬에는 GitHub PR 토큰이 없으므로 PR 댓글 실행은 GitHub Actions에서만 수행합니다. 같은 repo 브랜치 PR에서는 댓글을 생성/갱신하고, fork PR처럼 댓글 권한이 제한될 수 있는 경우에는 `qa-proof-artifacts/sample-pr-comment.md` artifact가 댓글 본문 대체물입니다.

## 데모 설명 순서

1. `qa-proof-artifacts/sample-pr-comment.md`를 먼저 보여준다.
2. 댓글 안의 확인 화면 표와 PM/CTO용 요약을 읽게 한다.
3. `qa-proof-artifacts/screenshots/`의 desktop/mobile 이미지를 연다.
4. 마지막에 `.github/workflows/pr-qa-proof.yml`을 보여주며 고객 repo에 붙이는 파일 단위를 설명한다.

GitHub Actions를 아직 돌리지 않은 상태에서는 `docs/sample-proof/sample-pr-comment.md`와 `docs/sample-proof/screenshots/`를 먼저 보여주면 됩니다.
