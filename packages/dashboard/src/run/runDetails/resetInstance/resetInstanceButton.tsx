import {
  SettingsBackupRestore as SettingsBackupRestoreIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
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
  Tooltip,
} from '@mui/material';
import {
  GetRunDocument,
  useResetInstanceMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAsync } from '@sorry-cypress/dashboard/hooks/';
import { client } from '@sorry-cypress/dashboard/lib/apolloClient';
import { getBase } from '@sorry-cypress/dashboard/lib/path';
import React, { useCallback, useEffect, useState } from 'react';

export const ResetInstanceButton = ({
  instanceId,
  spec,
  runId,
}: {
  instanceId: string;
  spec: string;
  runId: string;
}) => {
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
    client.reFetchObservableQueries();
    setShowModal(false);
  }, [deleteResult]);

  const deleteAction = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      startDeleteInstance();
    },
    [startDeleteInstance]
  );

  return (
    <>
      <Dialog
        aria-labelledby="reset-spec-dialog-title"
        aria-describedby="reset-spec-dialog-description"
        onClose={() => setShowModal(false)}
        open={shouldShowModal}
      >
        <DialogTitle id="reset-spec-dialog-title">
          Delete recorded data for `{getBase(spec)}` ?
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <WarningIcon fontSize="large" color="error" />
            </Grid>
            <Grid item xs>
              <DialogContentText id="reset-spec-dialog-description">
                This will remove result information for this instance. You will
                need to run the tests with the same
                <strong> ci-build-id </strong> again to re-record data for this
                instance.
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
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button variant="contained" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton
                loading={deleting}
                loadingPosition="start"
                color="error"
                variant="contained"
                onClick={deleteAction}
                startIcon={<SettingsBackupRestoreIcon />}
              >
                {deleting ? 'Resetting' : 'Reset'}
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <Tooltip title="Reset">
        <IconButton
          size="small"
          color="error"
          onClick={(e: any) => {
            e.stopPropagation();
            setShowModal(true);
          }}
        >
          <SettingsBackupRestoreIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};
