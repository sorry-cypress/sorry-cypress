import React from 'react';
import { Heading, useCss, Alert, HFlow } from 'bold-ui';
import { Paper, TestState } from '../common';
import { InstanceTest, InstanceScreeshot } from '../../generated/graphql';

type TestDetailsProps = {
  test: InstanceTest;
  screenshots: InstanceScreeshot[];
};
export function TestDetails({
  test,
  screenshots,
}: TestDetailsProps): React.ReactNode {
  const screenshot = screenshots.find((s) => s.testId === test.testId);
  const { css } = useCss();
  const title = test.title.join(' > ');
  return (
    <>
      <HFlow>
        <TestState state={test.state} />
        <Heading level={1}>{title}</Heading>
      </HFlow>
      {test.wallClockDuration && (
        <ul>
          <li>
            <span>Wall clock duration:</span> {test.wallClockDuration} msec
          </li>
        </ul>
      )}
      {test.error && (
        <Alert
          type="danger"
          style={{
            whiteSpace: 'pre',
            padding: 12,
          }}
        >
          <strong>{test.error}</strong>
          {test.stack && <div>{test.stack}</div>}
        </Alert>
      )}

      {screenshot && (
        <Paper>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={screenshot.screenshotURL}
          >
            <img
              className={css`
                 {
                  max-width: 100%;
                }
              `}
              src={screenshot.screenshotURL}
            />
          </a>
        </Paper>
      )}
    </>
  );
}
