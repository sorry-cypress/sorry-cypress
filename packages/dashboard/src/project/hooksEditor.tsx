import { Hook, HookType } from '@sorry-cypress/common';
import {
  useCreateBitbucketHookMutation,
  useCreateGenericHookMutation,
  useCreateGithubHookMutation,
  useCreateSlackHookMutation,
} from '@src/generated/graphql';
import {
  Alert,
  Button,
  Cell,
  Grid,
  HFlow,
  Icon,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
} from 'bold-ui';
import React, { useState } from 'react';
import { enumToString } from './hook/hook.utils';
import { HookEdit } from './hook/hookEdit';
import { useHooksFormReducer } from './hook/hookFormReducer';
import { useCurrentProjectId } from './hook/useCurrentProjectId';

export const HooksEditor = () => {
  const [operationError, setOperationError] = useState<string | null>(null);
  const [formState, dispatch] = useHooksFormReducer();
  const projectId = useCurrentProjectId();

  const [currentHookType, setCurrentHookType] = useState<HookType>(
    Object.keys(HookType).sort()[0] as HookType
  );

  const [createGenericHook] = useCreateGenericHookMutation();
  const [createBitbucketHook] = useCreateBitbucketHookMutation();
  const [createGithubHook] = useCreateGithubHookMutation();
  const [createSlackHook] = useCreateSlackHookMutation();

  async function createNewHook() {
    let fn:
      | typeof createGenericHook
      | typeof createBitbucketHook
      | typeof createGithubHook
      | typeof createSlackHook
      | null = null;
    let field = '';
    switch (currentHookType) {
      case HookType.SLACK_HOOK:
        fn = createSlackHook;
        field = 'createSlackHook';

        break;
      case HookType.GITHUB_STATUS_HOOK:
        fn = createGithubHook;
        field = 'createGithubHook';
        break;
      case HookType.BITBUCKET_STATUS_HOOK:
        fn = createBitbucketHook;
        field = 'createBitbucketHook';

        break;
      case HookType.GENERIC_HOOK:
        fn = createGenericHook;
        field = 'createGenericHook';
        break;

      default:
        throw new Error('Unknown hook type');
        break;
    }

    try {
      const result = await fn({
        variables: {
          input: {
            projectId,
          },
        },
      });
      if (result.errors) {
        setOperationError(result.errors[0].message);
        return;
      }

      dispatch({
        type: 'ADD_NEW_HOOK',
        payload: {
          hook: result.data[field],
        },
      });
    } catch (error) {
      console.error(error);
      setOperationError(error.toString());
      return;
    }
  }

  return (
    <Grid>
      <Cell xs={12}>
        <Text variant="h2">Hooks</Text>
      </Cell>
      {operationError && (
        <Cell xs={12}>
          <Alert type="danger" onCloseClick={() => setOperationError(null)}>
            {operationError}
          </Alert>
        </Cell>
      )}
      <Cell xs={12}>
        <HFlow alignItems="center">
          <Text>Select hook type: </Text>
          <Select
            itemToString={enumToString}
            items={Object.keys(HookType).sort()}
            name="hookType"
            onChange={(value: HookType) => {
              setCurrentHookType(value);
            }}
            value={currentHookType}
            clearable={false}
          />
          <Button size="small" onClick={createNewHook}>
            <Icon icon="plus" size={1.3} style={{ marginRight: '5px' }} />
            <span>Add Hook</span>
          </Button>
        </HFlow>
      </Cell>
      <Cell xs={12}>
        {!formState.hooks.length && <Text>No hooks defined</Text>}
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
      </Cell>
    </Grid>
  );
};
