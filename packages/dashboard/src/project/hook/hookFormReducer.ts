import { Hook, HookType, hookTypes } from '@sorry-cypress/common';
import { nanoid } from 'nanoid';

export type HooksFormState = {
  projectId: string;
  inactivityTimeoutSeconds: string;
  hooks: Hook[];
};

type SetProjectInactivityTimeout = {
  type: 'SET_PROJECT_INACTIVITY_TIMEOUT';
  payload: {
    timeout: string;
  };
};

type SetProjectName = {
  type: 'SET_PROJECT_NAME';
  payload: {
    name: string;
  };
};
type SetStateAction = {
  type: 'SET_STATE';
  payload: HooksFormState;
};

type SetHookType = {
  type: 'SET_HOOK_TYPE';
  payload: {
    hookId: string;
    type: HookType;
  };
};

type SetHookField = {
  type: 'SET_HOOK_FIELD';
  payload: {
    hookId: string;
    data: Partial<Hook>;
  };
};

type RemoveHook = {
  type: 'REMOVE_HOOK';
  payload: {
    hookId: string;
  };
};

type AddNewHook = {
  type: 'ADD_NEW_HOOK';
};

export type HookFormAction =
  | AddNewHook
  | SetProjectName
  | SetProjectInactivityTimeout
  | SetHookField
  | SetStateAction
  | SetHookType
  | RemoveHook;

export const hooksFormInitialState: HooksFormState = {
  inactivityTimeoutSeconds: '',
  projectId: '',
  hooks: [],
};
export const hookFormReducer = (
  state: HooksFormState,
  action: HookFormAction
): HooksFormState => {
  const originalHooks: Hook[] = state.hooks || [];
  switch (action.type) {
    case 'SET_STATE':
      return { ...hooksFormInitialState, ...action.payload };

    case 'SET_PROJECT_NAME':
      return { ...state, projectId: action.payload.name };

    case 'REMOVE_HOOK':
      return {
        ...state,
        hooks: originalHooks.filter((i) => i.hookId !== action.payload.hookId),
      };

    case 'ADD_NEW_HOOK':
      return {
        ...state,
        hooks: [
          ...originalHooks,
          {
            hookType: hookTypes.GENERIC_HOOK,
            url: '',
            hookId: nanoid(),
          },
        ],
      };

    case 'SET_HOOK_FIELD':
      return {
        ...state,
        hooks: originalHooks.map((h) => {
          if (h.hookId !== action.payload.hookId) {
            return { ...h };
          }
          return { ...h, ...action.payload.data };
        }),
      };

    case 'SET_PROJECT_INACTIVITY_TIMEOUT': {
      return {
        ...state,
        inactivityTimeoutSeconds: action.payload.timeout,
      };
    }
    default:
      throw new Error('Unknown action');
  }
};
