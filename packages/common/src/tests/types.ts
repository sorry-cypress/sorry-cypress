type TestState = 'passed' | 'failed' | 'pending' | undefined;

export type Test = TestV670 | TestV5 | LegacyTest;

export interface LegacyTest {
  testId: string;
  title: string;
  state: TestState;
  body: string;
  stack: string;
  error: string;
  timings: TestTimings;
  wallClockStartedAt: string;
  wallClockDuration: number;
}

export interface TestV5 {
  testId: string;
  title: string[];
  state: TestState;
  body: string;
  displayError: string | null;
  attempts: TestAttempt[];
}

export interface TestV670 {
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
