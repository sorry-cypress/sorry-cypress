import { DeleteOutline, Warning } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteIcon from '@mui/icons-material/Delete';
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
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  Hook,
  isBitbucketHook,
  isGChatHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
  isTeamsHook,
} from '@sorry-cypress/common';
import { useDeleteHookMutation } from '@sorry-cypress/dashboard/generated/graphql';
import { useSwitch } from '@sorry-cypress/dashboard/hooks/useSwitch';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BitbucketHook } from './bitbucketHook';
import { GChatHook } from './gChatHook';
import { GenericHook } from './genericHook';
import { GithubHook } from './githubHook';
import { enumToString } from './hook.utils';
import { HookFormAction } from './hookFormReducer';
import { SlackHook } from './slackHook';
import { TeamsHook } from './teamsHook';

const Toggler = ({ toggleExpanded, isExpanded, title }: any) => {
  return (
    <Box
      sx={{ cursor: 'pointer' }}
      display="flex"
      alignItems="center"
      onClick={() => toggleExpanded()}
    >
      {isExpanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      <Typography>{title}</Typography>
    </Box>
  );
};

export const HookEdit = ({
  hook,
  dispatch,
  disabled = false,
}: {
  hook: Hook;
  dispatch: React.Dispatch<HookFormAction>;
  disabled?: boolean;
}) => {
  const { projectId } = useParams();
  const [isExpanded, toggleExpanded] = useSwitch();
  const [isModalActive, setModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);
  const hookTitle =
    `${enumToString(hook.hookType)} ${hook.url}` ||
    `New ${enumToString(hook.hookType)}`;

  const [sendDeleteHook] = useDeleteHookMutation();

  async function deleteHook(hookId: string) {
    setDeleting(true);
    try {
      await sendDeleteHook({
        variables: {
          input: {
            projectId: projectId!,
            hookId,
          },
        },
      });
      setDeleting(false);
      dispatch({
        type: 'REMOVE_HOOK',
        payload: {
          hookId,
        },
      });
    } catch (error) {
      setDeleting(false);
      let errorMessage = 'Failed to delete hook';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setDeleteError(errorMessage);
      console.error(error);
    }
  }
  return (
    <>
      <Box
        style={{ display: 'flex' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Toggler
          toggleExpanded={toggleExpanded}
          isExpanded={isExpanded}
          title={hookTitle}
        />
        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={disabled}
          onClick={() => setModal(true)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      </Box>
      {isExpanded && <HookDetails hook={hook} />}
      <DeleteModal
        isModalActive={isModalActive}
        handleCloseModal={() => setModal(false)}
        handleDelete={() => deleteHook(hook.hookId)}
        deleting={deleting}
        hookName={hookTitle}
        deleteError={deleteError}
      />
    </>
  );
};

const HookDetails = ({ hook }: { hook: Hook }) => {
  return (
    <Grid container mt={2}>
      <Grid item xs={12}>
        {isGithubHook(hook) && <GithubHook hook={hook} />}
        {isGenericHook(hook) && <GenericHook hook={hook} />}
        {isSlackHook(hook) && <SlackHook hook={hook} />}
        {isBitbucketHook(hook) && <BitbucketHook hook={hook} />}
        {isTeamsHook(hook) && <TeamsHook hook={hook} />}
        {isGChatHook(hook) && <GChatHook hook={hook} />}
      </Grid>
    </Grid>
  );
};

interface IDeleteModalProps {
  isModalActive: boolean;
  handleCloseModal: () => void;
  handleDelete: () => void;
  deleting: boolean;
  hookName: string;
  deleteError?: string;
}

const DeleteModal = ({
  isModalActive,
  handleCloseModal,
  handleDelete,
  deleting,
  hookName,
  deleteError,
}: IDeleteModalProps) => {
  return (
    <Dialog
      aria-labelledby="delete-hook-dialog-title"
      aria-describedby="delete-hook-dialog-description"
      open={isModalActive}
      onClose={() => handleCloseModal()}
    >
      <DialogTitle id="delete-hook-dialog-title">
        Delete {hookName}?
      </DialogTitle>
      <DialogContent>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Warning fontSize="large" color="error" />
          </Grid>
          <Grid item xs>
            <DialogContentText id="delete-hook-dialog-description">
              Deleting hooks will permanently delete the associated data.
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
        <Button variant="contained" onClick={() => handleCloseModal()}>
          Cancel
        </Button>
        <LoadingButton
          loading={deleting}
          loadingPosition="start"
          variant="contained"
          color="error"
          onClick={() => handleDelete()}
          startIcon={<DeleteOutline />}
        >
          {deleting ? 'Deleting' : 'Delete'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
