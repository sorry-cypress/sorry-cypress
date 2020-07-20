import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heading,
  Cell,
  Grid,
  Text,
  Button,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Tooltip,
  useCss
} from 'bold-ui';
import { getRunTestsOverall, updateCacheOnDeleteRun } from '@src/lib/run';
import { Commit } from '@src/components/commit/commit';
import { Paper } from '../common/';
import {
  Run,
  useDeleteRunMutation,
  FullRunSpec,
} from '../../generated/graphql';
import { shortEnglishHumanizerWithMsIfNeeded,miniutesAndSecondsOptions } from '../../lib/utis';
import RenderOnInterval from '../renderOnInterval/renderOnInterval'



type RunSummaryProps = {
  run: Partial<Run> & { runId: string; specs: Array<FullRunSpec> };
};

export function RunSummary({ run }: RunSummaryProps): React.ReactNode {
  const { css } = useCss();
  const centeredIconClassName = css(`{
    display: flex;
    align-items: center;
  }`)
  const { meta, runId, specs } = run;
  const [startDeleteRunMutation] = useDeleteRunMutation({
    variables: {
      runId,
    },
    update: updateCacheOnDeleteRun,
  });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shouldShowModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!deleting) {
      return;
    }
    setDeleting(true);

    startDeleteRunMutation()
      .then((result) => {
        if (!mounted) {
          return;
        }
        if (result.errors) {
          setDeleteError(result.errors[0].message);
          setDeleting(false);
        } else {
          setDeleting(false);
          setShowModal(false);
        }
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        setDeleting(false);
        setDeleteError(error.toString());
      });
    return () => {
      mounted = false;
    };
  }, [deleting]);

  function deleteRun() {
    setDeleting(true);
  }

  const overall = getRunTestsOverall(run);
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
              <Heading level={1}>Delete run {run.meta?.ciBuildId}?</Heading>
              <Heading level={5}>
                Deleting run will permanently delete the associated data (run,
                instances, test results). Running tests associated with the run
                will fail.
              </Heading>
              {deleteError && <p>Delete error: {deleteError}</p>}
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
              onClick={deleteRun}
              disabled={deleting}
            >
              <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
              <Text color="inherit">{deleting ? 'Deleting' : 'Delete'}</Text>
            </Button>
          </HFlow>
        </ModalFooter>
      </Modal>
      <Paper>
        <HFlow justifyContent="space-between">
          <Heading level={1}>
            <Link to={`/run/${runId}`}>{meta?.ciBuildId}</Link>
          </Heading>
          <Button kind="danger" skin="ghost" onClick={() => setShowModal(true)}>
            <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
            <Text color="inherit">Delete</Text>
          </Button>
        </HFlow>
        <Grid>
          <Cell xs={12} md={6}>
            <div>
              <Text>Started At: {overall.wallClockStartedAt.toUTCString()}</Text>
            </div>
            <div>
              <Text>
                Durration:
                { overall?.wallClockDuration ? <Text>{shortEnglishHumanizerWithMsIfNeeded(overall?.wallClockDuration, miniutesAndSecondsOptions)}</Text> : null}
                {!overall?.wallClockDuration && overall.wallClockStartedAt ? (
                  <Text>
                    <RenderOnInterval live refreshIntervalInSeconds={1} renderChild={()=>{
                      return `${shortEnglishHumanizerWithMsIfNeeded(new Date() - new Date(overall.wallClockStartedAt), miniutesAndSecondsOptions)}`
                    }} />
                  </Text>
                ) : null}
              </Text>
            </div>
            <div style={{display:'flex'}}>
              <Text style={{marginRight: '10px'}}>
                <Tooltip text='Total Tests'>
                  <span className={centeredIconClassName}>
                    <Icon
                      icon="fileWithItensOutline"
                      size={1}
                    />
                    {overall.tests}
                  </span>
                </Tooltip>
              </Text>
              <Text color="success" style={{marginRight: '10px'}}>
                <Tooltip text='Successful'>
                  <span className={centeredIconClassName}>
                    <Icon
                      icon="checkCircleOutline"
                      size={1}
                    />
                    {overall.passes}
                  </span>
                </Tooltip>
              </Text>
              <Text color={overall.failures ? 'danger' : 'normal'} style={{marginRight: '10px'}}>
                <Tooltip text='Failed'>
                  <span className={centeredIconClassName}>
                    <Icon
                      icon="exclamationTriangleOutline"
                      size={1}
                    />
                    {overall.failures}
                  </span>
                </Tooltip>
              </Text>
              <Text color={overall.pending ? 'disabled' : 'normal'} style={{marginRight: '10px'}}>
                <Tooltip text='Skipped Tests'>
                  <span className={centeredIconClassName}>
                    <Icon
                      icon="timesOutline"
                      size={1}
                    />
                    {overall.pending}
                  </span>
                </Tooltip>
              </Text>
            </div>
          </Cell>
          <Cell xs={12} md={6}>
            <div>
              <strong>Spec files</strong>
              <ul>
                <li>Overall: {specs.length}</li>
                <li>Claimed: {specs.filter((s) => s?.claimed).length}</li>
              </ul>
            </div>
            <Commit commit={meta?.commit} />
          </Cell>
        </Grid>
      </Paper>
    </>
  );
}
