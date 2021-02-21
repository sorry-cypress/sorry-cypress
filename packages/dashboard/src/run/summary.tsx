import { Commit } from '@src/components/commit/commit';
import FlexRow from '@src/components/ui/FlexRow';
import HeaderLink from '@src/components/ui/HeaderLink';
import { useAsync } from '@src/hooks/useAsync';
import {
  Alert,
  Button,
  Cell,
  Grid,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  Tooltip,
  useCss,
} from 'bold-ui';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  FullRunSpec,
  GetRunsFeedDocument,
  Run,
  useDeleteRunMutation,
} from '@src/generated/graphql';
import { shortEnglishHumanizerWithMsIfNeeded } from '@src/lib/utis';
import { Paper } from '@src/components/common';
import { FormattedDate } from '@src/components/common/date';
import RenderOnInterval from '@src/components/renderOnInterval/renderOnInterval';
import { CiUrl } from '@src/components/ci/ci';
import { theme } from '@src/theme/theme';
import { getRunSummary } from '@sorry-cypress/common';

type RunSummaryProps = {
  run: Partial<Run> & { runId: string; specs: Array<FullRunSpec> };
};

const DeleteButton = ({
  runId,
  ciBuildId,
}: {
  runId: string;
  ciBuildId: string;
}) => {
  const {
    params: { projectId },
  } = useRouteMatch<{ projectId: string }>();

  const [deleteRunMutation] = useDeleteRunMutation({
    variables: {
      runId,
    },
    refetchQueries: [
      {
        query: GetRunsFeedDocument,
        variables: {
          filters: [
            {
              key: 'meta.projectId',
              value: projectId,
            },
          ],
          cursor: '',
        },
      },
    ],
  });
  const [startDeleteRun, deleting, deleteResult, deleteError] = useAsync(
    deleteRunMutation
  );
  const [shouldShowModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!deleteResult) {
      return;
    }
    setShowModal(false);
  }, [deleteResult]);

  return (
    <>
      <Modal
        size="small"
        onClose={() => setShowModal(false)}
        open={shouldShowModal}
      >
        <ModalBody>
          <HFlow alignItems="center">
            <Icon
              icon="exclamationTriangleFilled"
              style={{ marginRight: '0.5rem' }}
              size={3}
              fill="danger"
            />
            <div>
              <Heading level={1}>Delete run {ciBuildId}?</Heading>
              <Heading level={5}>
                Deleting run will permanently delete the associated data (run,
                instances, test results). Running tests associated with the run
                will fail.
              </Heading>
              {deleteError && (
                <Alert type="danger" style={{ margin: '1rem' }}>
                  Delete error: {deleteError.toString()}
                </Alert>
              )}
            </div>
          </HFlow>
        </ModalBody>
        <ModalFooter>
          <HFlow justifyContent="flex-end">
            <Button
              kind="normal"
              skin="ghost"
              onClick={() => setShowModal(false)}
            >
              <Text color="inherit">Cancel</Text>
            </Button>
            <Button
              kind="danger"
              skin="ghost"
              onClick={startDeleteRun}
              disabled={deleting}
            >
              <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
              <Text color="inherit">{deleting ? 'Deleting' : 'Delete'}</Text>
            </Button>
          </HFlow>
        </ModalFooter>
      </Modal>
      <Button kind="danger" skin="ghost" onClick={() => setShowModal(true)}>
        <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
        <Text color="inherit">Delete</Text>
      </Button>
    </>
  );
};

export function RunSummary({ run }: RunSummaryProps) {
  const { css } = useCss();
  const centeredIconClassName = css(`{
    display: flex;
    align-items: center;
  }`);
  const { meta, runId, specs } = run;

  const runSummary = getRunSummary(run);

  return (
    <Paper>
      <FlexRow>
        <HeaderLink to={`/run/${runId}`}>{meta?.ciBuildId}</HeaderLink>
        <DeleteButton runId={runId} ciBuildId={meta?.ciBuildId || ''} />
      </FlexRow>
      <Grid>
        <Cell xs={12} md={6}>
          <div>
            <Text>
              Started At:{' '}
              <FormattedDate value={runSummary.wallClockStartedAt} />
            </Text>
          </div>
          <div>
            <Text>
              Duration:{' '}
              {runSummary?.wallClockDuration ? (
                <Text>
                  {shortEnglishHumanizerWithMsIfNeeded(
                    runSummary?.wallClockDuration
                  )}
                </Text>
              ) : null}
              {!runSummary?.wallClockDuration &&
              runSummary.wallClockStartedAt ? (
                <Text>
                  <RenderOnInterval
                    live
                    refreshIntervalInSeconds={1}
                    renderChild={() => {
                      return `${shortEnglishHumanizerWithMsIfNeeded(
                        Date.now() -
                          new Date(runSummary.wallClockStartedAt).getTime()
                      )}`;
                    }}
                  />
                </Text>
              ) : null}
            </Text>
          </div>
          <div style={{ display: 'flex' }}>
            <Text style={{ marginRight: '10px' }}>
              <Tooltip text="Total Tests">
                <span className={centeredIconClassName}>
                  <Icon icon="fileWithItensOutline" size={1} />
                  {runSummary.tests}
                </span>
              </Tooltip>
            </Text>
            <Text color="success" style={{ marginRight: '10px' }}>
              <Tooltip text="Successful">
                <span className={centeredIconClassName}>
                  <Icon icon="checkCircleOutline" size={1} />
                  {runSummary.passes}
                </span>
              </Tooltip>
            </Text>
            <Text
              color={runSummary.failures ? 'danger' : 'normal'}
              style={{ marginRight: '10px' }}
            >
              <Tooltip text="Failed">
                <span className={centeredIconClassName}>
                  <Icon icon="exclamationTriangleOutline" size={1} />
                  {runSummary.failures}
                </span>
              </Tooltip>
            </Text>
            <Text
              color={runSummary.pending ? 'disabled' : 'normal'}
              style={{ marginRight: '10px' }}
            >
              <Tooltip text="Skipped Tests">
                <span className={centeredIconClassName}>
                  <Icon icon="timesOutline" size={1} />
                  {runSummary.pending}
                </span>
              </Tooltip>
            </Text>
          </div>

          <div style={{ marginTop: theme.sizes.text }}>
            <strong>Spec files</strong>
            <ul>
              <li>Overall: {specs.length}</li>
              <li>Claimed: {specs.filter((s) => s?.claimed).length}</li>
            </ul>
          </div>
        </Cell>
        <Cell xs={12} md={6}>
          <Commit commit={meta?.commit} />
          <CiUrl ciBuildId={meta?.ciBuildId} projectId={meta?.projectId} />
        </Cell>
      </Grid>
    </Paper>
  );
}
