import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, Typography } from '@mui/material';
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
import React from 'react';
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
      style={{ display: 'flex', cursor: 'pointer' }}
      onClick={() => toggleExpanded()}
      alignItems="center"
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
  const {
    params: { projectId },
  } = useRouteMatch<{ projectId: string }>();
  const [sendDeleteHook] = useDeleteHookMutation();

  async function deleteHook(hookId: string) {
    try {
      await sendDeleteHook({
        variables: {
          input: {
            projectId,
            hookId,
          },
        },
      });

      dispatch({
        type: 'REMOVE_HOOK',
        payload: {
          hookId,
        },
      });
    } catch (error) {
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
          title={`${enumToString(hook.hookType)}: ${hook.url || 'New Hook'}`}
        />
        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={disabled}
          onClick={() => deleteHook(hook.hookId)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      </Box>
      {isExpanded && <HookDetails hook={hook} />}
    </>
  );
};

const HookDetails = ({ hook }: { hook: Hook }) => {
  return (
    <Grid>
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
