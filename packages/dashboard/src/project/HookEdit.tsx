import { Hook } from '@src/duplicatedFromDirector/project.types';
import { useSwitch } from '@src/hooks/useSwitch';
import React from 'react';
import {
  isGithubHook,
  isGenericHook,
  isSlackHook,
  hookTypeToString,
} from './hook.utils';
import { Button, Icon, TableRow, TableCell, Select } from 'bold-ui';
import { hookType } from '@src/duplicatedFromDirector/hooksEnums';
import { GithubHook } from './GithubHook';
import { GenericHook } from './GenericHook';
import { HookFormAction } from './hookFormReducer';
import { SlackHook } from './SlackHook';

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
                items={Object.keys(hookType)}
                label="Hook Type"
                name="hookType"
                onChange={(value: hookType) => {
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
