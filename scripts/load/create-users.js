const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

const DEFAULT_API_URL = 'http://localhost:3333';

const API_URL = process.env.LOAD_TEST_API_URL || DEFAULT_API_URL;

const USERS_FILE = path.resolve(__dirname, 'data', 'users.json');

const REPORTS_DIRECTORY = path.resolve(__dirname, 'reports');

const REQUEST_DELAY_MS = Number(process.env.LOAD_TEST_DELAY_MS || 0);

const REQUEST_TIMEOUT_MS = Number(process.env.LOAD_TEST_TIMEOUT_MS || 15000);

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    throw new Error(
      [
        'Users data file was not found.',
        `Expected: ${USERS_FILE}`,
        'Run the user generator first.',
      ].join(' ')
    );
  }

  const content = fs.readFileSync(USERS_FILE, 'utf8');

  const users = JSON.parse(content);

  if (!Array.isArray(users) || users.length === 0) {
    throw new Error('Users data file must contain a non-empty array.');
  }

  return users;
}

function createFormData(user) {
  const formData = new FormData();

  formData.append('first_name', user.first_name);

  formData.append('last_name', user.last_name);

  formData.append('email', user.email);

  formData.append('password', user.password);

  formData.append('phone', user.phone);

  formData.append('cpf', user.cpf);

  return formData;
}

async function readResponseBody(response) {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();

    return text || null;
  } catch {
    return null;
  }
}

async function createUser(user, index) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const startedAt = performance.now();

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',

      body: createFormData(user),

      signal: controller.signal,
    });

    const durationMs = performance.now() - startedAt;

    const responseBody = await readResponseBody(response);

    return {
      index,

      email: user.email,

      success: response.ok,

      status: response.status,

      duration_ms: Number(durationMs.toFixed(2)),

      response: responseBody,
    };
  } catch (error) {
    const durationMs = performance.now() - startedAt;

    return {
      index,

      email: user.email,

      success: false,

      status: null,

      duration_ms: Number(durationMs.toFixed(2)),

      error: {
        name: error.name,

        message:
          error.name === 'AbortError'
            ? `Request exceeded ${REQUEST_TIMEOUT_MS} ms.`
            : error.message,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

function percentile(values, percentage) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const position = Math.ceil((percentage / 100) * sorted.length) - 1;

  return sorted[Math.max(0, position)];
}

function buildStatusSummary(results) {
  return results.reduce((summary, result) => {
    const key = result.status === null ? 'network_error' : String(result.status);

    summary[key] = (summary[key] || 0) + 1;

    return summary;
  }, {});
}

function buildSummary({ results, startedAt, finishedAt }) {
  const durations = results.map((result) => result.duration_ms);

  const successful = results.filter((result) => result.success).length;

  const failed = results.length - successful;

  const totalDurationMs = finishedAt - startedAt;

  const durationSum = durations.reduce((total, duration) => total + duration, 0);

  return {
    total_requests: results.length,

    successful_requests: successful,

    failed_requests: failed,

    success_rate_percent: Number(((successful / results.length) * 100).toFixed(2)),

    status_codes: buildStatusSummary(results),

    execution: {
      total_duration_ms: Number(totalDurationMs.toFixed(2)),

      total_duration_seconds: Number((totalDurationMs / 1000).toFixed(2)),

      requests_per_second: Number((results.length / (totalDurationMs / 1000)).toFixed(2)),
    },

    latency_ms: {
      min: durations.length ? Math.min(...durations) : 0,

      max: durations.length ? Math.max(...durations) : 0,

      average: durations.length ? Number((durationSum / durations.length).toFixed(2)) : 0,

      p50: percentile(durations, 50),

      p95: percentile(durations, 95),

      p99: percentile(durations, 99),
    },
  };
}

function generateReportFileName() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  return path.join(REPORTS_DIRECTORY, `create-users-${timestamp}.json`);
}

function saveReport(report) {
  fs.mkdirSync(REPORTS_DIRECTORY, {
    recursive: true,
  });

  const reportFile = generateReportFileName();

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

  return reportFile;
}

function printRequestResult(result, total) {
  const prefix = `[${String(result.index).padStart(String(total).length, '0')}/${total}]`;

  const status = result.status ?? 'ERR';

  const marker = result.success ? 'OK' : 'FAIL';

  console.log([prefix, marker, status, `${result.duration_ms}ms`, result.email].join(' | '));
}

function printSummary(summary, reportFile) {
  console.log('');
  console.log('Sequential user creation finished.');

  console.log('');
  console.log(`Requests: ${summary.total_requests}`);

  console.log(`Successful: ${summary.successful_requests}`);

  console.log(`Failed: ${summary.failed_requests}`);

  console.log(`Success rate: ${summary.success_rate_percent}%`);

  console.log('');
  console.log(`Total time: ${summary.execution.total_duration_seconds}s`);

  console.log(`Throughput: ${summary.execution.requests_per_second} req/s`);

  console.log('');
  console.log(`Latency min: ${summary.latency_ms.min} ms`);

  console.log(`Latency avg: ${summary.latency_ms.average} ms`);

  console.log(`Latency p50: ${summary.latency_ms.p50} ms`);

  console.log(`Latency p95: ${summary.latency_ms.p95} ms`);

  console.log(`Latency p99: ${summary.latency_ms.p99} ms`);

  console.log(`Latency max: ${summary.latency_ms.max} ms`);

  console.log('');
  console.log('Status codes:');

  for (const [status, count] of Object.entries(summary.status_codes)) {
    console.log(`  ${status}: ${count}`);
  }

  console.log('');
  console.log(`Report: ${reportFile}`);
}

async function main() {
  const users = loadUsers();

  console.log(`API: ${API_URL}`);

  console.log(`Users: ${users.length}`);

  console.log(`Timeout: ${REQUEST_TIMEOUT_MS} ms`);

  console.log(`Delay: ${REQUEST_DELAY_MS} ms`);

  console.log('');

  const results = [];

  const startedAt = performance.now();

  for (let index = 0; index < users.length; index += 1) {
    const result = await createUser(users[index], index + 1);

    results.push(result);

    printRequestResult(result, users.length);

    if (REQUEST_DELAY_MS > 0 && index < users.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  const finishedAt = performance.now();

  const summary = buildSummary({
    results,
    startedAt,
    finishedAt,
  });

  const report = {
    generated_at: new Date().toISOString(),

    configuration: {
      api_url: API_URL,

      endpoint: '/users',

      mode: 'sequential',

      request_timeout_ms: REQUEST_TIMEOUT_MS,

      delay_between_requests_ms: REQUEST_DELAY_MS,
    },

    summary,

    results,
  };

  const reportFile = saveReport(report);

  printSummary(summary, reportFile);

  if (summary.failed_requests > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Load test execution failed.');

  console.error(error);

  process.exitCode = 1;
});
