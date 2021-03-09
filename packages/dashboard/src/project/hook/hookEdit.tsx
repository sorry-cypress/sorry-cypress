import styled from '@emotion/styled';
import {
  Hook,
  HookType,
  isBitbucketHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
} from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { useSwitch } from '@src/hooks/useSwitch';
import { Button, Cell, Grid, HFlow, Icon, Select, Text } from 'bold-ui';
import React from 'react';
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
  disabled,
}: {
  hook: Hook;
  dispatch: React.Dispatch<HookFormAction>;
  disabled: boolean;
}) => {
  const [isExpanded, toggleExpanded] = useSwitch();
  return (
    <>
      <HFlow justifyContent="space-between">
        <Toggler
          toggleExpanded={toggleExpanded}
          isExpanded={isExpanded}
          title={hook.url || 'New Hook'}
        />
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
        <InputFieldLabel label="Hook Type" htmlFor="hookType">
          <Select
            itemToString={hookTypeToString}
            items={Object.keys(HookType)}
            name="hookType"
            onChange={(value: HookType) => {
              dispatch({
                type: 'SET_HOOK_FIELD',
                payload: {
                  hookId: hook.hookId,
                  data: {
                    hookType: value,
                  },
                },
              });
            }}
            value={hook.hookType}
            clearable={false}
          />
        </InputFieldLabel>
      </Cell>

      <Cell xs={12}>
        {isGithubHook(hook) && (
          <GithubHook hook={hook} dispatch={dispatch} disabled={disabled} />
        )}
        {isGenericHook(hook) && (
          <GenericHook dispatch={dispatch} disabled={disabled} hook={hook} />
        )}
        {isSlackHook(hook) && (
          <SlackHook dispatch={dispatch} disabled={disabled} hook={hook} />
        )}
        {isBitbucketHook(hook) && (
          <BitbucketHook dispatch={dispatch} disabled={disabled} hook={hook} />
        )}
      </Cell>
      <Cell xs={12} style={{ textAlign: 'right' }}>
        <Button
          kind="danger"
          skin="ghost"
          size="small"
          disabled={disabled}
          onClick={() => {
            dispatch({
              type: 'REMOVE_HOOK',
              payload: {
                hookId: hook.hookId,
              },
            });
          }}
        >
          Remove Hook
        </Button>
      </Cell>
    </Grid>
  );
};
