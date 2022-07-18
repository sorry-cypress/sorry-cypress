import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Button,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { Hook, HookType } from '@sorry-cypress/common';
import {
  useCreateBitbucketHookMutation,
  useCreateGChatHookMutation,
  useCreateGenericHookMutation,
  useCreateGithubHookMutation,
  useCreateSlackHookMutation,
  useCreateTeamsHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import React, { useState } from 'react';
import { InputFieldLabel, Paper } from '../components';
import { enumToString } from './hook/hook.utils';
import { HookEdit } from './hook/hookEdit';
import { useHooksFormReducer } from './hook/hookFormReducer';
import { useCurrentProjectId } from './hook/useCurrentProjectId';
// This needs serious refactoring - it's a mess 😃
export const HooksEditor = () => {
  const [operationError, setOperationError] = useState<string | null>(null);
  const [formState, dispatch] = useHooksFormReducer();
  const projectId = useCurrentProjectId();

  const [currentHookType, setCurrentHookType] = useState<HookType | undefined>(
    undefined
  );

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentHookType(event.target.value as HookType);
  };

  const [createGenericHook] = useCreateGenericHookMutation();
  const [createBitbucketHook] = useCreateBitbucketHookMutation();
  const [createGithubHook] = useCreateGithubHookMutation();
  const [createSlackHook] = useCreateSlackHookMutation();
  const [createTeamsHook] = useCreateTeamsHookMutation();
  const [createGChatHook] = useCreateGChatHookMutation();

  async function createNewHook() {
    const input = {
      projectId,
    };
    let fn:
      | typeof createGenericHook
      | typeof createBitbucketHook
      | typeof createGithubHook
      | typeof createSlackHook
      | typeof createTeamsHook
      | typeof createGChatHook
      | null = null;
    let field = '';
    switch (currentHookType) {
      case HookType.SLACK_HOOK:
        fn = createSlackHook;
        field = 'createSlackHook';
        // @ts-ignore
        input.slackResultFilter = null;
        setCurrentHookType(undefined);
        break;
      case HookType.GITHUB_STATUS_HOOK:
        fn = createGithubHook;
        field = 'createGithubHook';
        setCurrentHookType(undefined);
        break;
      case HookType.TEAMS_HOOK:
        fn = createTeamsHook;
        field = 'createTeamsHook';
        setCurrentHookType(undefined);
        break;
      case HookType.BITBUCKET_STATUS_HOOK:
        fn = createBitbucketHook;
        field = 'createBitbucketHook';
        setCurrentHookType(undefined);
        break;
      case HookType.GENERIC_HOOK:
        fn = createGenericHook;
        field = 'createGenericHook';
        setCurrentHookType(undefined);
        break;
      case HookType.GCHAT_HOOK:
        fn = createGChatHook;
        field = 'createGChatHook';
        setCurrentHookType(undefined);
        break;
      default:
        setCurrentHookType(undefined);
        throw new Error('Unknown hook type');
    }

    try {
      const result = await fn({
        variables: {
          // @ts-ignore
          input,
        },
      });
      if (result.errors) {
        setOperationError(result.errors[0].message);
        return;
      }

      dispatch({
        type: 'ADD_NEW_HOOK',
        payload: {
          // @ts-ignore 😤
          hook: result.data[field],
        },
      });
    } catch (error: any) {
      console.error(error);
      setOperationError(error.toString());
      return;
    }
  }

  return (
    <Paper>
      <Typography variant="h6">Hooks</Typography>
      <Grid container spacing={2}>
        {operationError && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setOperationError(null)}>
              {operationError}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <InputFieldLabel
            helpText="Select the hook type you want to configure"
            htmlFor="hookType"
            label="Select hook type"
          >
            <Select
              size="small"
              id="hookType"
              onChange={handleChange}
              value={currentHookType || ''}
            >
              {Object.keys(HookType)
                .sort()
                .map((hook) => (
                  <MenuItem key={hook} value={hook}>
                    {enumToString(hook)}
                  </MenuItem>
                ))}
            </Select>
          </InputFieldLabel>
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={!currentHookType}
            variant="contained"
            color="primary"
            onClick={createNewHook}
          >
            <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
            Add Hook
          </Button>
        </Grid>
        <Grid item xs={12}>
          {!formState.hooks.length && (
            <Typography variant="body1">No hooks defined</Typography>
          )}
          <Table>
            <TableBody>
              {formState.hooks?.map((hook: Hook) => (
                <TableRow key={hook.hookId}>
                  <TableCell>
                    <HookEdit hook={hook} dispatch={dispatch} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
};
