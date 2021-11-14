import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { BitBucketHook as BitbucketHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateBitbucketHookInput,
  useUpdateBitbucketHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useSwitch } from '@sorry-cypress/dashboard/hooks/useSwitch';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCurrentProjectId } from './useCurrentProjectId';
import { bitbucketUrlValidation } from './validation';

interface BitbucketHookPros {
  hook: BitbucketHookType;
}
export const BitbucketHook = ({ hook }: BitbucketHookPros) => {
  const projectId = useCurrentProjectId();
  const [editToken, toggleEditToken] = useSwitch();
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
  });

  const [showToken, toggleToken] = useSwitch();
  const [updateBitbucketHook, { loading }] = useUpdateBitbucketHookMutation();
  async function onSubmit(input: UpdateBitbucketHookInput) {
    try {
      await updateBitbucketHook({
        variables: {
          input: { ...input, hookId: hook.hookId, projectId },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  const hasErrors = Object.keys(errors).length > 0;
  const disabled = loading;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Grid item xs={12}>
          <InputFieldLabel
            label="URL"
            htmlFor="url"
            required
            helpText="Bitbucket repository URL, e.g. https://bitbucket.org/sorry-cypress/sorry-cypress.git"
            errorMessage={errors['url']?.message}
          >
            <TextField
              type="search"
              name="url"
              defaultValue={hook.url}
              placeholder="e.g. https://bitbucket.org/project/demo.git"
              inputRef={register({
                required: {
                  value: true,
                  message: 'Bitbucket repository URL is required',
                },

                validate: {
                  bitbucketUrlValidation,
                },
              })}
              disabled={disabled}
              size="small"
            />
          </InputFieldLabel>
        </Grid>

        <Grid item xs={12}>
          <InputFieldLabel
            label="Bitbucket&nbsp;Username"
            htmlFor="bitbucketUsername"
            errorMessage={errors['bitbucketUsername']?.message}
            required
          >
            <TextField
              name="bitbucketUsername"
              type="search"
              placeholder={'Enter Bitbucket username'}
              inputRef={register({
                required: {
                  value: true,
                  message: 'Bitbucket username is required',
                },
              })}
              defaultValue={hook.bitbucketUsername}
              disabled={disabled}
              size="small"
            />
          </InputFieldLabel>
        </Grid>

        <Grid item xs={12}>
          <InputFieldLabel
            required
            label={
              <span>
                Bitbucket&nbsp;App&nbsp;Password&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://bitbucket.org/account/settings/app-passwords/"
                >
                  (Create One)
                </a>
              </span>
            }
            htmlFor="bitbucketToken"
            errorMessage={errors['bitbucketToken']?.message}
            helpText="Generate this token on bitbucket. Once this token is saved you will not be able to see it again. You will alwayse be able to update it."
          >
            {hook.bitbucketToken && !editToken && (
              <>
                Using saved token
                <Link onClick={() => toggleEditToken(true)}>Edit</Link>
              </>
            )}
            {(!hook.bitbucketToken || editToken) && (
              <OutlinedInput
                autoComplete="new-password"
                type={showToken ? 'text' : 'password'}
                name="bitbucketToken"
                placeholder="Enter Bitbucket App Password with repo:write access"
                inputRef={register({
                  required: {
                    value: true,
                    message: 'Bitbucket token is required',
                  },
                })}
                defaultValue={''}
                disabled={disabled}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle token visibility"
                      onClick={() => toggleToken()}
                      edge="end"
                    >
                      {showToken ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                size="small"
              />
            )}
          </InputFieldLabel>
        </Grid>

        <Grid item xs={12}>
          <InputFieldLabel
            label="Bitbucket Build Name"
            htmlFor="bitbucketBuildName"
            helpText='This string will be used as a build name in Bitbucket. Default value is "sorry-cypress".'
            errorMessage={errors['bitbucketBuildName']?.message}
          >
            <TextField
              name="bitbucketBuildName"
              placeholder="Enter custom string to differentiate this status from others"
              defaultValue={hook.bitbucketBuildName}
              inputRef={register}
              disabled={disabled}
              size="small"
            />
          </InputFieldLabel>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={hasErrors || loading}
            type="submit"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
