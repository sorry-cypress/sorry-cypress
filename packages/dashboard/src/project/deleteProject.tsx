import { Warning } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { Paper } from '@sorry-cypress/dashboard/components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProjectMutation } from '../generated/graphql';
import { client } from '../lib/apolloClient';
import { useCurrentProjectId } from './hook/useCurrentProjectId';

export const DeleteProject = () => {
  const navigate = useNavigate();
  const projectId = useCurrentProjectId();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shouldShowModal, setShowModal] = useState(false);

  const [startDeleteProjectMutation] = useDeleteProjectMutation({
    variables: {
      projectId,
    },
  });

  function deleteProject() {
    setDeleting(true);
    startDeleteProjectMutation()
      .then((result) => {
        if (result.errors) {
          setDeleteError(result.errors[0].message);
          setDeleting(false);
        } else {
          setDeleting(false);
          setShowModal(false);
        }
        client.reFetchObservableQueries();
        navigate('/');
      })
      .catch((error) => {
        setDeleting(false);
        setDeleteError(error.toString());
      });
  }

  return (
    <>
      <Paper>
        <Typography variant="h6">Remove Project</Typography>
        <Typography variant="body1" gutterBottom component="div">
          By removing this project, all runs will be deleted and will no longer
          be available.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowModal(true)}
            startIcon={<DeleteIcon />}
            disabled={deleting}
          >
            {deleting ? 'Deleting' : 'Delete'}
          </Button>
        </Box>
      </Paper>
      <Dialog
        aria-labelledby="delete-project-dialog-title"
        aria-describedby="delete-project-dialog-description"
        open={shouldShowModal}
        onClose={() => setShowModal(false)}
      >
        <DialogTitle id="delete-project-dialog-title">
          Delete project `{projectId}`?
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Warning fontSize="large" color="error" />
            </Grid>
            <Grid item xs>
              <DialogContentText id="delete-project-dialog-description">
                Deleting project will permanently delete the associated data
                (project, run, instances, test results).
                <br />
                Running tests associated with the project will fail.
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
            variant="contained"
            color="error"
            onClick={deleteProject}
            startIcon={<DeleteIcon />}
          >
            {deleting ? 'Deleting' : 'Delete'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
