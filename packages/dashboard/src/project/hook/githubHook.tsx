import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { GithubHook as GithubHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateGithubHookInput,
  useUpdateGithubHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useSwitch } from '@sorry-cypress/dashboard/hooks/useSwitch';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCurrentProjectId } from './useCurrentProjectId';
import { githubUrlValidation } from './validation';

interface GithubHookPros {
  hook: GithubHookType;
}
export const GithubHook = ({ hook }: GithubHookPros) => {
  const projectId = useCurrentProjectId();
  const [editToken, toggleEditToken] = useSwitch();
  const [editPrivateKey, togglePrivateKey] = useSwitch();
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
  });

  const [githubAuthType, setAuthType] = useState<'token' | 'app'>(
    hook.githubAuthType || 'token'
  );

  const updateGithubAuthType = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAuthType(event.target.value === 'app' ? 'app' : 'token');

  const [showToken, toggleToken] = useSwitch();
  const [updateHook, { loading }] = useUpdateGithubHookMutation();
  async function onSubmit(input: UpdateGithubHookInput) {
    try {
      await updateHook({
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
            helpText="The github authentication mechanism you want to use. Currently app and token authentication is supported"
            label="Authentication mechanism"
            htmlFor="githubAuthType"
            errorMessage={errors['githubAuthType']?.message}
            required
          >
            <RadioGroup
              row
              value={githubAuthType}
              defaultValue={hook.githubAuthType || 'token'}
              name="githubAuthType"
              onChange={updateGithubAuthType}
            >
              <FormControlLabel
                value="token"
                control={<Radio inputRef={register} />}
                label="Github token"
              />
              <FormControlLabel
                value="app"
                control={<Radio inputRef={register} />}
                label="Github app"
              />
            </RadioGroup>
          </InputFieldLabel>
        </Grid>
        <Grid item xs={12}>
          <InputFieldLabel
            helpText="This is the GitHub repository URL, e.g. https://github.com/sorry-cypress/sorry-cypress"
            label="URL"
            htmlFor="url"
            errorMessage={errors['url']?.message}
            required
          >
            <TextField
              name="url"
              placeholder="e.g. https://github.com/sorry-cypress/sorry-cypress"
              inputRef={register({
                required: {
                  value: true,
                  message: 'Github repository URL is required',
                },

                validate: {
                  githubUrlValidation,
                },
              })}
              defaultValue={hook.url}
              disabled={disabled}
              size="small"
            />
          </InputFieldLabel>
        </Grid>
        {githubAuthType === 'token' && (
          <Grid item xs={12}>
            <InputFieldLabel
              helpText="Your private GitHub token with repo:status permissions. Once this token is saved you will not be able to see it again. You will always be able to update it."
              label={
                <span>
                  Github Token&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Sorry-cypress-status"
                  >
                    (Create One)
                  </a>
                </span>
              }
              htmlFor="githubToken"
              errorMessage={errors['githubToken']?.message}
              required
            >
              {hook.githubToken && !editToken && (
                <>
                  Using saved token
                  <Link onClick={() => toggleEditToken(true)}>Edit</Link>
                </>
              )}
              {(!hook.githubToken || editToken) && (
                <OutlinedInput
                  inputRef={register({
                    required: {
                      value: true,
                      message: 'Github token is required',
                    },
                  })}
                  type={showToken ? 'text' : 'password'}
                  name="githubToken"
                  id="new-password"
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
                  label="Password"
                  size="small"
                />
              )}
            </InputFieldLabel>
          </Grid>
        )}
        {githubAuthType === 'app' && (
          <div>
            <Grid item xs={12}>
              <InputFieldLabel
                helpText="Your private key from the github app. Once it is saved you can no longer see it. You will always be able to update it."
                label={
                  <span>
                    Github App Private Key&nbsp;
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.github.com/en/developers/overview/managing-deploy-keys#server-to-server-tokens"
                    >
                      (App setup instructions)
                    </a>
                  </span>
                }
                htmlFor="githubAppPrivateKey"
                errorMessage={errors['githubAppPrivateKey']?.message}
                required
              >
                {hook.githubAppPrivateKey && !editPrivateKey && (
                  <>
                    Using saved private key
                    <Link onClick={() => togglePrivateKey(true)}>Edit</Link>
                  </>
                )}
                {(!hook.githubAppPrivateKey || editPrivateKey) && (
                  <OutlinedInput
                    inputRef={register({
                      required: {
                        value: true,
                        message: 'App private key is required',
                      },
                    })}
                    minRows={5}
                    type="text"
                    multiline={true}
                    name="githubAppPrivateKey"
                    id="new-password"
                    disabled={disabled}
                    label="Private key"
                    size="small"
                  />
                )}
              </InputFieldLabel>
            </Grid>
            <Grid item xs={12}>
              <InputFieldLabel
                helpText="The ID from your github app"
                label="App Id"
                htmlFor="appId"
                errorMessage={errors['githubAppId']?.message}
              >
                <TextField
                  name="githubAppId"
                  placeholder="Github app id"
                  defaultValue={hook.githubAppId}
                  inputRef={register}
                  disabled={disabled}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </InputFieldLabel>
            </Grid>
            <Grid item xs={12}>
              <InputFieldLabel
                helpText="The ID from your github app installation"
                label="Installation Id"
                htmlFor="githubAppInstallationId"
                errorMessage={errors['githubAppInstallationId']?.message}
              >
                <TextField
                  name="githubAppInstallationId"
                  placeholder="Github app installation id"
                  defaultValue={hook.githubAppInstallationId}
                  inputRef={register}
                  disabled={disabled}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </InputFieldLabel>
            </Grid>
          </div>
        )}
        <Grid item xs={12}>
          <InputFieldLabel
            helpText='Status label in GitHub to differentiate this project status from others. Default value is "Sorry-Cypress-Tests"'
            label="Status Label"
            htmlFor="githubContext"
            errorMessage={errors['githubContext']?.message}
          >
            <TextField
              name="githubContext"
              placeholder="Enter custom string to differentiate this status from others"
              defaultValue={hook.githubContext}
              inputRef={register}
              disabled={disabled}
              size="small"
            />
          </InputFieldLabel>
        </Grid>
        <Grid>
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
