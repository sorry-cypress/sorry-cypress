import {
  DeleteOutline as DeleteOutlineIcon,
  SettingsBackupRestore as SettingsBackupRestoreIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  GetRunDocument,
  useResetInstanceMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAsync } from '@sorry-cypress/dashboard/hooks/';
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
      <Dialog onClose={() => setShowModal(false)} open={shouldShowModal}>
        <DialogTitle>Delete recorded data for `{getBase(spec)}` ?</DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <WarningIcon fontSize="large" color="error" />
            </Grid>
            <Grid item xs>
              <Typography variant="body1">
                This will remove result information for this instance. You will
                need to run the tests with the same
                <strong> ci-build-id </strong> again to re-record data for this
                instance.
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
                onClick={deleteAction}
                disabled={deleting}
                startIcon={<DeleteOutlineIcon />}
              >
                {deleting ? 'Resetting' : 'Reset'}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <Tooltip title="Rest">
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
