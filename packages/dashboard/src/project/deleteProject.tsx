import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Paper } from '@sorry-cypress/dashboard/components';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDeleteProjectMutation } from '../generated/graphql';
import { useCurrentProjectId } from './hook/useCurrentProjectId';

export const DeleteProject = () => {
  const history = useHistory();
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
        history.push('/');
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
            disabled={deleting}
          >
            <DeleteIcon />
            <Typography variant="body1">
              {deleting ? 'Deleting' : 'Delete'}
            </Typography>
          </Button>
        </Box>
      </Paper>
      <Dialog
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        open={shouldShowModal}
        onClose={() => setShowModal(false)}
      >
        <DialogTitle>
          <WarningIcon fontSize="large" color="error" />
          <br />
          Delete project {projectId}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting project will permanently delete the associated data
            (project, run, instances, test results). Running tests associated
            with the project will fail.
            {deleteError && <p>Delete error: {deleteError}</p>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteProject}
            disabled={deleting}
          >
            <DeleteIcon />
            {deleting ? 'Deleting' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
