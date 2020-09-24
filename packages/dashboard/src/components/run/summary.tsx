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
import {
  getRunTestsOverall,
  updateCacheOnDeleteRun,
  getRunMetaData,
} from '@src/lib/run';
import './summary.css';
import { Commit } from '@src/components/commit/commit';
import { Paper } from '../common/';
import {
  Run,
  useDeleteRunMutation,
  FullRunSpec,
} from '../../generated/graphql';
import { environment } from '@src/state/environment';

type RunSummaryProps = {
  run: Partial<Run> & { runId: string; specs: Array<FullRunSpec> };
};

export function RunSummary({ run }: RunSummaryProps): React.ReactNode {
  const { meta, runId, specs, createdAt } = run;
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
  const metaData = getRunMetaData(run);

  return (
    <>
      {/* <Modal
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
                            <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }}/>
                            <Text color="inherit">{deleting ? 'Deleting' : 'Delete'}</Text>
                        </Button>
                    </HFlow>
                </ModalFooter>
            </Modal> */}

      <div className={'t-element'}>
        <span className={`t-state t-state--${overall.state}`}></span>
        <div className={'t-title'}>
          <img
            className={'t-is-front-img'}
            src={
              metaData.isTriggeredFromFront
                ? 'https://angular.io/assets/images/logos/angular/angular.svg'
                : 'https://nodejs.org/static/images/logo.svg'
            }
          />
          <span className={`t-tag t-tag--${metaData.tag}`}>{metaData.tag}</span>
          <h1 style={{ flexGrow: 1 }}>
            <a
              href={`${environment.BASE_URL}/run/${runId}`}
              style={{ marginRight: '24px' }}
            >
              {metaData?.commitSha}
            </a>
            {metaData?.commitMsg}
          </h1>
          {/* <Button kind="danger" skin="ghost" onClick={() => setShowModal(true)}>
                        <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }}/>
                    </Button> */}
        </div>
        <HFlow
          alignItems="center"
          style={{ marginBottom: '12px', marginLeft: '24px' }}
        >
          <h4>
            Branch:{' '}
            <a href={`${environment.BASE_URL}/?branch=${metaData?.branch}`}>
              {metaData?.branch ?? 'unknown branch'}
            </a>
          </h4>
          <h4>Author: {metaData.commitAuthor}</h4>
          <h4>created at: {new Date(run.createdAt).toLocaleString()}</h4>
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
          </Cell>
        </Grid>
      </div>
    </>
  );
}
