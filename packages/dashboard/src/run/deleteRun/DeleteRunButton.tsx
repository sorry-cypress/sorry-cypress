import {
  GetRunsFeedDocument,
  useDeleteRunMutation,
} from '@src/generated/graphql';
import { useAsync } from '@src/hooks/';
import {
  Alert,
  Button,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
} from 'bold-ui';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

export const DeleteRunButton = ({
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
      <Button
        kind="normal"
        size="small"
        skin="ghost"
        onClick={() => setShowModal(true)}
      >
        <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
        <Text color="inherit">Delete</Text>
      </Button>
    </>
  );
};
