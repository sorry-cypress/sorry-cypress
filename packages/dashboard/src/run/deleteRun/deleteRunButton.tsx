import { DeleteOutline, Warning } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import {
  GetRunsFeedDocument,
  useDeleteRunMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAsync } from '@sorry-cypress/dashboard/hooks/';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const DeleteRunButton: DeleteRunButtonComponent = (props) => {
  const { runId, ciBuildId } = props;

  const { projectId } = useParams();
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
      <Dialog
        aria-labelledby="delete-run-dialog-title"
        aria-describedby="delete-run-dialog-description"
        onClose={() => setShowModal(false)}
        open={shouldShowModal}
      >
        <DialogTitle id="delete-run-dialog-title">
          Delete run `{ciBuildId}`?
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Warning fontSize="large" color="error" />
            </Grid>
            <Grid item xs>
              <DialogContentText id="delete-run-dialog-description">
                Deleting run will permanently delete the associated data (run,
                instances, test results).
                <br />
                Running tests associated with the run will fail.
              </DialogContentText>
              {deleteError && (
                <Alert severity="error">
                  <AlertTitle>Delete error</AlertTitle>
                  {deleteError.toString()}
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={deleting}
            loadingPosition="start"
            color="error"
            variant="contained"
            onClick={startDeleteRun}
            startIcon={<DeleteOutline />}
          >
            {deleting ? 'Deleting' : 'Delete'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <IconButton
        aria-label="delete"
        onClick={() => setShowModal(true)}
        color="error"
        size="small"
      >
        <DeleteOutline />
      </IconButton>
    </>
  );
};

type DeleteRunButtonProps = {
  runId: string;
  ciBuildId: string;
};
type DeleteRunButtonComponent = FunctionComponent<DeleteRunButtonProps>;
