const { detectFramework } = require("./core/detectFramework");
const { parseTestResults } = require("./core/parseTestResults");
const { rerunTests } = require("./core/rerunTests");
const { runTests } = require("./core/runTests");
const { writeJSON } = require("./utils/file");

async function main() {
  let fileMap = {
    jest: "jest-results.json",
    mocha: "mocha-results.json",
    vitest: "vitest-results.json",
    playwright: "playwright-results.json",
    cypress: "mochawesome-report/mochawesome.json",
    default: "default-results.json",
  };

  console.log("FlakeyRadar started...");

  const framework = detectFramework();
  console.log("Detected Framework: ", framework);

  const rawOutput = runTests(framework);

  const filePath = fileMap[framework];
  const failedTest = parseTestResults(filePath, framework);

  const totalTests = getTotalTestCount(filePath, framework);

  const flakyResults = await rerunTests(failedTest, framework);

  writeJSON("flaky-results.json", { totalTests, results: flakyResults });

  console.log("Flaky results saved");
}

main();
