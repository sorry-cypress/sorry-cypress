import { Hook } from '@sorry-cypress/common';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';

export type HooksFormState = {
  hooks: Hook[];
};

type SetStateAction = {
  type: 'SET_STATE';
  payload: HooksFormState;
};

type RemoveHook = {
  type: 'REMOVE_HOOK';
  payload: {
    hookId: string;
  };
};

type AddNewHook = {
  type: 'ADD_NEW_HOOK';
  payload: {
    hook: Hook;
  };
};

export type HookFormAction = AddNewHook | SetStateAction | RemoveHook;

export const hooksFormInitialState: HooksFormState = {
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

    case 'REMOVE_HOOK':
      return {
        ...state,
        hooks: originalHooks.filter((i) => i.hookId !== action.payload.hookId),
      };

    case 'ADD_NEW_HOOK':
      return {
        ...state,
        hooks: [...originalHooks, action.payload.hook],
      };

    default:
      throw new Error('Unknown action');
  }
};

const HookFormContext = createContext<any>(null);
export const WithHooksForm = ({ children }: PropsWithChildren<any>) => {
  const hookForm = useReducer(hookFormReducer, hooksFormInitialState);
  return (
    <HookFormContext.Provider value={hookForm}>
      {children}
    </HookFormContext.Provider>
  );
};

export const useHooksFormReducer = () => useContext(HookFormContext);
