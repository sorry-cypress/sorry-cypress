import { hookType } from '@src/duplicatedFromDirector/hooksEnums';
import { Hook } from '@src/duplicatedFromDirector/project.types';

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
    type: hookType;
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
  | SetHookField
  | SetStateAction
  | SetHookType
  | RemoveHook;

export interface HooksFormState {
  projectId: string;
  hooks: Hook[];
}
export const hooksFormInitialState: HooksFormState = {
  projectId: '',
  hooks: [],
};
export const hookFormReducer = (
  state: HooksFormState,
  action: HookFormAction
) => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'SET_PROJECT_NAME':
      return { ...state, projectId: action.payload.name };

    case 'REMOVE_HOOK':
      return {
        ...state,
        hooks: state.hooks.filter((i) => i.hookId !== action.payload.hookId),
      };

    case 'ADD_NEW_HOOK':
      return {
        ...state,
        hooks: [
          ...state.hooks,
          {
            hookId: 'some',
            hookType: hookType.GENERIC_HOOK,
          },
        ],
      } as HooksFormState;

    case 'SET_HOOK_FIELD':
      return {
        ...state,
        hooks: state.hooks.map((h) => {
          if (h.hookId !== action.payload.hookId) {
            return { ...h };
          }
          return { ...h, ...action.payload.data };
        }),
      };

    default:
      return state;
  }
};
