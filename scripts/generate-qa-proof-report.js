const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const artifactDir = path.join(root, "qa-proof-artifacts");
const screenshotsDir = path.join(artifactDir, "screenshots");
const resultsPath = path.join(artifactDir, "check-results.json");
const reportPath = path.join(artifactDir, "qa-proof-report.md");
const commentPath = path.join(artifactDir, "sample-pr-comment.md");
const summaryPath = path.join(artifactDir, "github-step-summary.md");

function readResults() {
  if (!fs.existsSync(resultsPath)) {
    return {
      generatedAt: new Date().toISOString(),
      checks: [],
      note: "Playwright results were not found."
    };
  }

  return JSON.parse(fs.readFileSync(resultsPath, "utf8"));
}

function listFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...listFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      entries.push(fullPath);
    }
  }
  return entries;
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function markdownTable(rows) {
  return rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function generateReports(options = {}) {
  fs.mkdirSync(artifactDir, { recursive: true });

  const results = readResults();
  const checks = results.checks || [];
  const passed = checks.filter((check) => check.status === "passed").length;
  const failed = checks.filter((check) => check.status === "failed").length;
  const exitCode = typeof options.exitCode === "number" ? options.exitCode : 0;
  const missingChecks = checks.length === 0;
  const needsAttention = exitCode !== 0 || missingChecks || failed > 0;
  const statusLabel = needsAttention ? "확인 필요" : "통과";
  const screenshotFiles = listFiles(screenshotsDir, (file) => file.endsWith(".png")).map(relative);
  const failureArtifacts = listFiles(path.join(artifactDir, "test-results"), (file) =>
    /\.(webm|zip|trace)$/.test(file)
  ).map(relative);

  const checkRows = [
    ["화면", "뷰포트", "결과", "증거"],
    ["---", "---", "---", "---"],
    ...(checks.length
      ? checks.map((check) => [
          check.screen,
          check.viewport,
          check.status === "passed" ? "통과" : "확인 필요",
          check.screenshot ? check.screenshot : check.error || "결과 없음"
        ])
      : [["결과 없음", "-", "확인 필요", results.note || "check-results.json 없음"]])
  ];

  const screenshotList = screenshotFiles.length
    ? screenshotFiles.map((file) => `- \`${file}\``).join("\n")
    : "- 생성된 screenshot이 없습니다.";

  const failureList = failureArtifacts.length
    ? failureArtifacts.map((file) => `- \`${file}\``).join("\n")
    : "- 이번 실행은 통과 상태라 실패 video/trace가 생성되지 않았습니다. 실패 시 `qa-proof-artifacts/test-results/`에 남습니다.";

  const report = `# QA Proof Report

생성 시각: ${results.generatedAt}
실행 결과: ${statusLabel}
Playwright exit code: ${exitCode}

## PM/CTO용 요약

이번 PR proof는 핵심 화면을 자동으로 열고 desktop/mobile screenshot과 체크 결과를 남겼습니다. 목적은 반복 화면 확인 시간을 줄이고, 눈에 보이는 화면 회귀 위험을 PR 단계에서 빠르게 확인하는 것입니다.

## 확인 범위

- 홈: PR QA proof 데모 메시지와 CTA 확인
- 가격/비교: 수동 확인 대비 proof 셋업 비교표 확인
- 설정: 고객 repo 적용 체크리스트 확인
- desktop viewport: 1365x768
- mobile viewport: 390x844

## 체크 결과

${markdownTable(checkRows)}

## 생성된 screenshot

${screenshotList}

## 실패 artifact

${failureList}

## 다음 조치

- 통과: PR 댓글에서 screenshot과 체크 결과를 확인하고 리뷰를 진행합니다.
- 확인 필요: artifact의 video/trace를 열어 깨진 화면과 재현 경로를 먼저 확인합니다.
- 적용 확대: 고객 repo에서는 핵심 화면 2~3개부터 고정한 뒤 결제/온보딩처럼 민감한 화면을 추가합니다.
`;

  const comment = `<!-- qa-proof-demo:summary -->
## PR QA Proof Summary

상태: ${statusLabel}

### PM/CTO용 요약

핵심 화면 ${checks.length}개 체크가 실행되었습니다. 이 proof는 반복 화면 확인 시간을 줄이고 PR 단계에서 화면 회귀 위험을 빨리 보이게 하기 위한 자동 증거입니다.

${markdownTable(checkRows)}

### 생성 파일

- \`qa-proof-artifacts/qa-proof-report.md\`
- \`qa-proof-artifacts/sample-pr-comment.md\`
- \`qa-proof-artifacts/screenshots/\`
- \`qa-proof-artifacts/test-results/\` 실패 시 video/trace 저장

### 리뷰어 확인 순서

1. 위 표에서 실패 또는 확인 필요 항목을 먼저 본다.
2. screenshot artifact에서 desktop/mobile 화면을 확인한다.
3. 실패가 있으면 video/trace artifact로 재현 경로를 본다.
`;

  fs.writeFileSync(reportPath, report);
  fs.writeFileSync(commentPath, comment);
  fs.writeFileSync(summaryPath, report);

  console.log(`Wrote ${relative(reportPath)}`);
  console.log(`Wrote ${relative(commentPath)}`);
  return { checks, failed, passed, reportPath, commentPath, summaryPath, exitCode };
}

if (require.main === module) {
  generateReports();
}

module.exports = { generateReports };
