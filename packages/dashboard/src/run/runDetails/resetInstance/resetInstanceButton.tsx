import {
  GetRunDocument,
  useResetInstanceMutation,
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
import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

export const ResetInstanceButton = ({
  instanceId,
  runId,
}: {
  instanceId: string;
  runId: string;
}) => {
  const {
    params: { projectId },
  } = useRouteMatch<{ projectId: string }>();

  const [resetInstance] = useResetInstanceMutation({
    variables: {
      instanceId: instanceId,
    },
    refetchQueries: [
      {
        query: GetRunDocument,
        variables: {
          runId: runId,
        },
      },
    ],
  });

  const [startDeleteInstance, deleting, deleteResult, deleteError] = useAsync(
    resetInstance
  );
  const [shouldShowModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!deleteResult) {
      return;
    }
    setShowModal(false);
  }, [deleteResult]);

  const deleteAction = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('deleting here');
      startDeleteInstance();
    },
    [startDeleteInstance]
  );

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
              <Heading level={1}>Delete instance {instanceId}?</Heading>
              <Heading level={5}>
                This will remove result information for this instance. You will
                need to run the tests again to re-record data for this instance.
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
              onClick={deleteAction}
              disabled={deleting}
            >
              <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
              <Text color="inherit">{deleting ? 'Resetting' : 'Reset'}</Text>
            </Button>
          </HFlow>
        </ModalFooter>
      </Modal>
      <Button
        kind="normal"
        size="small"
        skin="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
        <Text color="inherit">Reset</Text>
      </Button>
    </>
  );
};
