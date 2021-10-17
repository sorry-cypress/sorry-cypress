import { DeleteOutline, Warning } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  GetRunsFeedDocument,
  useDeleteRunMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAsync } from '@sorry-cypress/dashboard/hooks/';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

export const DeleteRunButton: DeleteRunButtonComponent = (props) => {
  const { runId, ciBuildId } = props;

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
      <Dialog onClose={() => setShowModal(false)} open={shouldShowModal}>
        <DialogTitle>Delete run `{ciBuildId}`?</DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Warning fontSize="large" color="error" />
            </Grid>
            <Grid item xs>
              <Typography variant="body1">
                Deleting run will permanently delete the associated data (run,
                instances, test results).
                <br />
                Running tests associated with the run will fail.
              </Typography>
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
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button color="inherit" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="error"
                variant="contained"
                onClick={startDeleteRun}
                disabled={deleting}
                startIcon={<DeleteOutline />}
              >
                {deleting ? 'Deleting' : 'Delete'}
              </Button>
            </Grid>
          </Grid>
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
