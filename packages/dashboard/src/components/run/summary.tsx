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
} from 'bold-ui';
import { getRunTestsOverall, updateCacheOnDeleteRun } from '@src/lib/run';
import { Commit } from '@src/components/commit/commit';
import { Paper } from '../common/';
import {
  Run,
  useDeleteRunMutation,
  FullRunSpec,
} from '../../generated/graphql';

type RunSummaryProps = {
  run: Partial<Run> & { runId: string; specs: Array<FullRunSpec> };
};
export function RunSummary({ run }: RunSummaryProps): React.ReactNode {
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
