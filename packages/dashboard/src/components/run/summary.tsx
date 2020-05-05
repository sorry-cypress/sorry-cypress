import React, { useState } from 'react';
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
} from 'bold-ui';
import { getRunTestsOverall, updateCacheOnDeleteRun } from '@src/lib/run';
import { Commit } from '@src/components/commit/commit';
import { Paper } from '../common/';
import { Run, useDeleteRunMutation } from '../../generated/graphql';

type RunSummaryProps = {
  run: Run;
};
export function RunSummary({ run }: RunSummaryProps): React.ReactNode {
  const { meta, runId, specs } = run;
  const [startDeleteRunMutation, { loading: deleting }] = useDeleteRunMutation({
    variables: {
      runId,
    },
    update: updateCacheOnDeleteRun,
  });
  const [shouldShowModal, setShowModal] = useState(false);

  const overall = getRunTestsOverall(run);

  function deleteRun() {
    if (deleting) return;
    startDeleteRunMutation().then(() => {
      setShowModal(false);
    });
  }

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
              <Heading level={1}>Delete run</Heading>
              <Heading level={5}>
                Deleting run will permanently delete the associated data (run,
                instances, test results). Running tests associated with the run
                will fail.
              </Heading>
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
            <ul>
              <li>
                <Text>Tests: {overall.tests}</Text>
              </li>
              <li>
                <Text>Passes: {overall.passes}</Text>
              </li>
              <li>
                <Text color={overall.failures ? 'danger' : 'normal'}>
                  Failures: {overall.failures}
                </Text>
              </li>
              <li>
                <Text color={overall.pending ? 'disabled' : 'normal'}>
                  Skipped: {overall.pending}
                </Text>
              </li>
            </ul>
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
