import styled from '@emotion/styled';
import {
  Hook,
  isBitbucketHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
} from '@sorry-cypress/common';
import { useDeleteHookMutation } from '@src/generated/graphql';
import { useSwitch } from '@src/hooks/useSwitch';
import { Button, Cell, Grid, HFlow, Icon, Text } from 'bold-ui';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { BitbucketHook } from './bitbucketHook';
import { GenericHook } from './genericHook';
import { GithubHook } from './githubHook';
import { hookTypeToString } from './hook.utils';
import { HookFormAction } from './hookFormReducer';
import { SlackHook } from './slackHook';

const TogglerWrapper = styled(HFlow)`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 3rem;
`;
const Toggler = ({ toggleExpanded, isExpanded, title }: any) => {
  return (
    <TogglerWrapper onClick={() => toggleExpanded()} alignItems="center">
      {isExpanded ? (
        <Icon icon="angleDown" size={1} />
      ) : (
        <Icon icon="angleRight" size={1} />
      )}
      <Text fontWeight="bold">{title}</Text>
    </TogglerWrapper>
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
      <HFlow justifyContent="space-between" alignItems="center">
        <Toggler
          toggleExpanded={toggleExpanded}
          isExpanded={isExpanded}
          title={`${hookTypeToString(hook.hookType)}: ${
            hook.url || 'New Hook'
          }`}
        />
        <Button
          kind="danger"
          skin="ghost"
          size="small"
          disabled={disabled}
          onClick={() => deleteHook(hook.hookId)}
        >
          Remove
        </Button>
      </HFlow>
      {isExpanded && (
        <HookDetails hook={hook} disabled={disabled} dispatch={dispatch} />
      )}
    </>
  );
};

const HookDetails = ({
  dispatch,
  hook,
  disabled,
}: {
  hook: Hook;
  dispatch: React.Dispatch<HookFormAction>;
  disabled: boolean;
}) => {
  return (
    <Grid style={{ padding: '1rem' }}>
      <Cell xs={12}>
        {isGithubHook(hook) && (
          <GithubHook hook={hook} dispatch={dispatch} disabled={disabled} />
        )}
        {isGenericHook(hook) && <GenericHook dispatch={dispatch} hook={hook} />}
        {isSlackHook(hook) && (
          <SlackHook dispatch={dispatch} disabled={disabled} hook={hook} />
        )}
        {isBitbucketHook(hook) && (
          <BitbucketHook dispatch={dispatch} disabled={disabled} hook={hook} />
        )}
      </Cell>
      <Cell xs={12}>
        <HFlow justifyContent="space-between"></HFlow>
      </Cell>
    </Grid>
  );
};
