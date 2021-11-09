import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import {
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
  isGenericHook,
  isGithubHook,
  isSlackHook,
  isTeamsHook,
} from '@sorry-cypress/common';
import { useDeleteHookMutation } from '@sorry-cypress/dashboard/generated/graphql';
import { useSwitch } from '@sorry-cypress/dashboard/hooks/useSwitch';
import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { BitbucketHook } from './bitbucketHook';
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
  const [isExpanded, toggleExpanded] = useSwitch();
  const [isModalActive, setModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);
  const hookTitle =
    `${enumToString(hook.hookType)} ${hook.url}` ||
    `New ${enumToString(hook.hookType)}`;

  const {
    params: { projectId },
  } = useRouteMatch<{ projectId: string }>();
  const [sendDeleteHook] = useDeleteHookMutation();

  async function deleteHook(hookId: string) {
    setDeleting(true);
    try {
      await sendDeleteHook({
        variables: {
          input: {
            projectId,
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
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      open={isModalActive}
      onClose={() => handleCloseModal()}
    >
      <DialogTitle>
        <WarningIcon fontSize="large" color="error" />
        <br />
        Delete {hookName}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting hooks will permanently delete the associated data.
          {deleteError && <p>Delete error: {deleteError}</p>}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCloseModal()}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete()}
          disabled={deleting}
        >
          <DeleteIcon />
          {deleting ? 'Deleting' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
