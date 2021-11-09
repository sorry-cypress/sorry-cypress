import { ExpandMore as ExpandMoreIcon, Science } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  colors,
  Grid,
  Typography,
} from '@mui/material';
import {
  INSTANCE_STATE_COLORS,
  TEST_STATE_ICONS,
} from '@sorry-cypress/dashboard/components';
import {
  InstanceScreeshot,
  InstanceTest,
  TestAttempt as TestAttemptData,
} from '@sorry-cypress/dashboard/generated/graphql';
import { get } from 'lodash';
import React, { FunctionComponent } from 'react';
import { Screenshot, TestError } from './common';

const PendingTest = (props: { showSamples?: boolean }) => {
  const { showSamples } = props;

  return (
    <Alert severity="info">
      <AlertTitle>Pending test</AlertTitle>
      This test didn’t run because it is a pending or placeholder test.
      {showSamples && (
        <Box mt={7}>
          <strong>Sample placeholder and pending tests:</strong>
          <pre>
            {`
    it('is not written yet and it’s only a placeholder test');

    it.skip('won’t run because it is skipped', function () {
      // ...
    })

    xit('won't run because it is skipped', () => {
      // ...
    })`}
          </pre>
        </Box>
      )}
    </Alert>
  );
};

const SkippedTest = (props: { showSamples?: boolean }) => {
  const { showSamples } = props;

  return (
    <Alert severity="info">
      <AlertTitle>Skipped test</AlertTitle>
      This test didn’t run because it is skipped. Skipped tests are those that
      you meant to run, but they were skipped due to some run-time error.
      {showSamples && (
        <Box mt={3}>
          <strong>For example,</strong> if a group of tests sharing the same
          beforeEach hook, and a command inside the beforeEach hook fails then
          the first test is marked as failed, and the remaining tests in that
          block will be <i>skipped</i>.
        </Box>
      )}
    </Alert>
  );
};

const PassedTest = (props: { flaky?: boolean }) => {
  const { flaky } = props;

  return (
    <Alert severity="success">
      Test has passed!{' '}
      {flaky && (
        <Box mt={2}>
          <strong>Note: some attempts failed</strong>
        </Box>
      )}
    </Alert>
  );
};

const TestAttempt: TestAttemptComponent = (props) => {
  const { attempt, flaky, screenshot, title, testState } = props;

  return (
    <Accordion sx={{ boxShadow: 'none', mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          component={
            attempt.error
              ? TEST_STATE_ICONS.failed
              : TEST_STATE_ICONS[testState || 'unknown']
          }
          sx={{
            mr: 1,
            color: get(colors, [
              INSTANCE_STATE_COLORS[
                (attempt.error ? 'failed' : testState) || 'unknown'
              ],
              400,
            ]),
          }}
        ></Box>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            {attempt.error && (
              <TestError
                name={attempt.error.name}
                error={attempt.error.message}
                stack={attempt.error.stack}
              />
            )}
            {testState === 'pending' && <PendingTest showSamples />}
            {testState === 'skipped' && <SkippedTest showSamples />}
            {testState === 'passed' && !attempt.error && (
              <PassedTest flaky={flaky} />
            )}
          </Grid>
          <Grid item xs={12}>
            <Screenshot screenshot={screenshot} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export const TestDetailsV5: TestDetailsV5Component = (props) => {
  const { test, screenshots } = props;

  return (
    <>
      <Accordion sx={{ boxShadow: 'none', mb: 1 }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            component={Science}
            sx={{
              mr: 1,
            }}
          ></Box>
          <Typography>Test result</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              {test.state === 'passed' && (
                <PassedTest flaky={test.attempts.length > 1} />
              )}
              {test.state === 'pending' && <PendingTest />}
              {test.state === 'skipped' && <SkippedTest />}
              {test.displayError && <TestError error={test.displayError} />}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {test.attempts.map((attempt, index, all) => (
        <TestAttempt
          key={index}
          flaky={test.attempts.length > 1}
          title={`Attempt ${index + 1} of ${all.length}`}
          attempt={attempt}
          screenshot={screenshots[index]}
          testState={test.state}
        />
      ))}
    </>
  );
};

type TestAttemptProps = {
  title: string;
  flaky?: boolean;
  testState: keyof typeof TEST_STATE_ICONS;
  attempt: TestAttemptData;
  screenshot: Partial<InstanceScreeshot>;
};

type TestAttemptComponent = FunctionComponent<TestAttemptProps>;

type TestDetailsV5Props = {
  test: InstanceTest;
  screenshots: Partial<InstanceScreeshot>[];
};
type TestDetailsV5Component = FunctionComponent<TestDetailsV5Props>;
