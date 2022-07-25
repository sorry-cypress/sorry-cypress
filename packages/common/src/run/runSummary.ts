type TestShape = {
  state?: string;
  attempts: any[];
};

export function isTestFlaky(test: TestShape) {
  if (test.state !== 'passed') {
    return false;
  }
  return test.attempts.length > 1;
}
