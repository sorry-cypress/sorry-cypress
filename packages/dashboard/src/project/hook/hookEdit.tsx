import {
  Hook,
  HookType,
  hookTypes,
  isGenericHook,
  isGithubHook,
  isSlackHook,
} from '@sorry-cypress/common';
import { useSwitch } from '@src/hooks/useSwitch';
import { Button, Icon, Select, TableCell, TableRow } from 'bold-ui';
import React from 'react';
import { GenericHook } from './genericHook';
import { GithubHook } from './githubHook';
import { hookTypeToString } from './hook.utils';
import { HookFormAction } from './hookFormReducer';
import { SlackHook } from './slackHook';

const Toggler = ({ toggleExpanded, isExpanded, title }: any) => {
  return (
    <TableRow onClick={() => toggleExpanded()}>
      <TableCell>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          <div>
            {isExpanded ? (
              <Icon icon="angleDown" size={1.5} />
            ) : (
              <Icon icon="angleRight" size={1.5} />
            )}
          </div>
          <span>{title}</span>
        </div>
      </TableCell>
    </TableRow>
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
  const [isExpanded, toggleExpanded] = useSwitch(false);
  return (
    <>
      <Toggler
        toggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        title={hook.url || 'New Hook'}
      />
      {isExpanded && (
        <TableRow>
          <TableCell style={{ padding: '20px 30px 30px 30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Select
                itemToString={hookTypeToString}
                items={Object.keys(hookTypes)}
                label="Hook Type"
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
            </div>
            {isGithubHook(hook) && (
              <GithubHook hook={hook} dispatch={dispatch} disabled={disabled} />
            )}
            {isGenericHook(hook) && (
              <GenericHook
                dispatch={dispatch}
                disabled={disabled}
                hook={hook}
              />
            )}
            {isSlackHook(hook) && (
              <SlackHook dispatch={dispatch} disabled={disabled} hook={hook} />
            )}
            <Button
              kind="danger"
              skin="outline"
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
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
