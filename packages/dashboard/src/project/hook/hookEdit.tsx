import styled from '@emotion/styled';
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
import { Button, Cell, Grid, HFlow, Icon, Text } from 'bold-ui';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { BitbucketHook } from './bitbucketHook';
import { GenericHook } from './genericHook';
import { GithubHook } from './githubHook';
import { enumToString } from './hook.utils';
import { HookFormAction } from './hookFormReducer';
import { SlackHook } from './slackHook';
import { TeamsHook } from './teamsHook';

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
          title={`${enumToString(hook.hookType)}: ${hook.url || 'New Hook'}`}
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
      {isExpanded && <HookDetails hook={hook} />}
    </>
  );
};

const HookDetails = ({ hook }: { hook: Hook }) => {
  return (
    <Grid style={{ padding: '1rem' }}>
      <Cell xs={12}>
        {isGithubHook(hook) && <GithubHook hook={hook} />}
        {isGenericHook(hook) && <GenericHook hook={hook} />}
        {isSlackHook(hook) && <SlackHook hook={hook} />}
        {isBitbucketHook(hook) && <BitbucketHook hook={hook} />}
        {isTeamsHook(hook) && <TeamsHook hook={hook} />}
      </Cell>
      <Cell xs={12}>
        <HFlow justifyContent="space-between"></HFlow>
      </Cell>
    </Grid>
  );
};
