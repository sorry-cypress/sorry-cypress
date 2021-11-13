import AddIcon from '@mui/icons-material/Add';
import { Chip, Grid, TextField } from '@mui/material';
import { SlackHook } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import React, { ChangeEvent, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface EditBranchFilterProps {
  hook: SlackHook;
  disabled: boolean;
}

export const EditBranchFilter = ({ hook, disabled }: EditBranchFilterProps) => {
  const { errors, setError, clearErrors, control } = useFormContext();
  return (
    <Controller
      control={control}
      name="slackBranchFilter"
      defaultValue={hook.slackBranchFilter}
      render={({ value, onChange }) => (
        <BranchFilter
          hook={hook}
          branches={value}
          disabled={disabled}
          errors={errors}
          setError={setError}
          clearErrors={clearErrors}
          onChange={onChange}
        />
      )}
    />
  );
};

interface BranchFilterProps {
  hook: SlackHook;
  branches: string[];
  disabled: boolean;
  errors: any;
  setError: any;
  clearErrors: any;
  onChange: any;
}

const BranchFilter = ({
  branches,
  disabled,
  errors,
  setError,
  clearErrors,
  onChange,
}: BranchFilterProps) => {
  const [inputBranchName, setInputBranchName] = useState('');

  const handleInput = (e: ChangeEvent) => {
    const input = (e.target as HTMLInputElement).value;
    setInputBranchName(input);
    if (input !== '') {
      setError('slackBranchFilter', {
        type: 'custom',
        message:
          'Please submit entered branch name by pressing "Enter" key or clicking "+" button',
      });
    } else {
      clearErrors('slackBranchFilter');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBranch();
    }
  };

  const addBranch = () => {
    if (!inputBranchName) {
      return;
    }

    if (branches?.includes(inputBranchName)) {
      setError('slackBranchFilter', {
        type: 'custom',
        message: 'Entered value already exists!',
      });
      return;
    }

    const newBranchesList = branches ? branches.slice() : [];
    newBranchesList.push(inputBranchName.trim().toLowerCase());
    onChange(newBranchesList);

    setInputBranchName('');
  };

  const deleteBranch = (name: string) => {
    const newBranchesList = branches?.filter((item) => item !== name);
    onChange(newBranchesList);
  };

  return (
    <Grid item xs={12}>
      <InputFieldLabel
        helpText='Filter for branches. You can specify branch names which only will trigger a webhook.
          You can use "?" and "*" wildcard characters
          (e.g. "release-20??-*" pattern will match both "release-2021-1" and "release-2022-alpha" branches).
          You can also use "!" to exclude branches from triggering the webhook.
          (e.g. "!Release-*-alpha" pattern will exclude "release-2021-1-alpha" and "release-2021-alpha" branches)
          Leaving this control blank activates all the branches.'
        label={<span>Branch Filter</span>}
        htmlFor="slackBranchFilter"
        error={errors['slackBranchFilter']?.message}
      >
        <TextField
          name={'slackBranchFilter'}
          placeholder="Enter branch name"
          disabled={disabled}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          value={inputBranchName}
          InputProps={{
            endAdornment: (
              <AddIcon
                onClick={() => addBranch()}
                style={{ cursor: 'pointer' }}
              />
            ),
          }}
          size="small"
        />
        <Grid item xs={12}>
          {branches &&
            branches.map((branch, index) => (
              <Chip
                color="primary"
                onDelete={() => deleteBranch(branch)}
                key={index}
                label={branch}
                style={{ margin: '3px' }}
              />
            ))}
        </Grid>
      </InputFieldLabel>
    </Grid>
  );
};
