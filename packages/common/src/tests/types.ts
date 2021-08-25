type TestState = 'passed' | 'failed' | 'pending' | undefined;

export interface Test {
  clientId: string;
  state: TestState;
  displayError: string | null;
  title: string[];
  config: null | TestConfig;
  hookIds: string[];
  body: string;
  attempts: TestAttempt[];
}

interface TestConfig {
  retries: number;
}

interface TestCodeFrame {
  line: number;
  column: number;
  originalFile: string;
  relativeFile: string;
  absoluteFile: string;
  frame: string;
  language: string;
}

interface TestError {
  name: string;
  message: string;
  stack: string;
  codeFrame: TestCodeFrame;
}
interface TestTimings {
  lifecycle: number;
  test: {
    fnDuration: number;
    afterFnDuration: number;
  };
}
interface TestAttempt {
  state: TestState;
  error: TestError | null;
  timings: TestTimings;
  failedFromHookId: null;
  wallClockStartedAt: string;
  wallClockDuration: number;
  videoTimestamp: number;
}
