import { useApolloClient } from '@apollo/react-hooks';
import React, { useState } from 'react';
import { useGetProjectQuery, useCreateProjectMutation, useUpdateProjectMutation } from '../generated/graphql';
import {
  Button,
  Icon,
  Tooltip,
  TextField,
  Grid,
  Cell,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Select
} from 'bold-ui';
import { useHistory } from "react-router-dom";
import setWith from 'lodash.setwith';
import clone from 'lodash.clone';
import clonedeep from 'lodash.clonedeep';
import capitalize from 'lodash.capitalize';
import {hookEvents, hookTypes} from '@src/duplicatedFromDirector/hooksEnums';
import {Project} from '@src/duplicatedFromDirector/project.types'

type ProjectEditViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

function removeHiddenKeysFromObject(subject:any){
  return Object.keys(subject).forEach((key)=>{
    if (key.indexOf('_') === 0) {
      // remove "hidden" keys from subjects
      delete subject[key];
    }
  })
}

function formatProjectForSaving(project:Project) {
  project = clonedeep(project);
  removeHiddenKeysFromObject(project);
  project?.hooks?.forEach((hook:any) => {
    removeHiddenKeysFromObject(hook);
  });
  return project;
}

export function ProjectEditView({
  match: {
    params: { projectId },
  },
}:ProjectEditViewProps) {
  const history = useHistory();
  const apollo = useApolloClient();
  const isNewProject = projectId === '--create-new-project--';
  apollo.writeData({
    data: {
      navStructure: [],
    },
  });
  

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formState, setFormState] = useState({projectId:''});

  const {loading, error, data} = useGetProjectQuery({
    variables: {
      projectId: projectId
    },
    onCompleted: (data)=>{
      setFormState(isNewProject || !data?.project ? {projectId:''} : data?.project);
    }
  });

  const [startCreateProjectMutation] = useCreateProjectMutation();

  const [startUpdateProjectMutation] = useUpdateProjectMutation ();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateProject() {
    setUpdating(true);
    const project = formatProjectForSaving(formState);
    startUpdateProjectMutation({
      variables:{
        project
      }
    }).then((result) => {
      if (result.errors) {
        setUpdateError(result.errors[0].message);
      } else {
        history.push(`/${result.data?.updateProject.projectId}/runs`);
      }
      setUpdating(false);
    }).catch((error) => {
      setUpdating(false);
      setUpdateError(error.toString());
    });
  }

  function createProject() {
    setCreating(true);
    const project = formatProjectForSaving(formState);
    startCreateProjectMutation({
      variables:{
        project
      }
    }).then((result) => {
      if (result.errors) {
        setCreateError(result.errors[0].message);
      } else {
        history.push(`/${result.data?.createProject.projectId}/runs`);
      }
      setCreating(false);
    }).catch((error) => {
      setCreating(false);
      setCreateError(error.toString());
    });
  }

  if (!isNewProject) {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.toString()}</p>;
    if (!data) {
      return <p>No data</p>;
    }
    if (!data.project) {
      return <p>Not a recognized project</p>;
    }
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isNewProject) {
      createProject();
    }else {
      updateProject();
    }
  }

  const handleChange = (path: string) => (eventOrValue:any) => {
    const element = eventOrValue.target
    const elementValue = element && (element.type === 'checkbox' ? element.checked : element.value);

    setFormState(state => (
      setWith(
        clone(state),
        path,
        (
          typeof elementValue === "string" ?
          elementValue :
          eventOrValue
        ),
        clone
      )
    ))
  }


  return (
    <form onSubmit={handleSubmit}>
      {createError || updateError ? (
        <div>
          {createError || updateError}
        </div>
      ): null}
      <Grid wrap>
        <Cell xs={6}>
          <TextField
            name='projectId'
            label='Project Id'
            placeholder='Enter your "projectId"'
            value={formState.projectId}
            onChange={handleChange('projectId')}
            disabled={!isNewProject || creating || updating || loading}
            required
          />
        </Cell>
        <div style={{
          display: 'flex',
          alignSelf: 'flex-end',
          marginBottom: '14px'
        }}>
          <Tooltip text='This must match the "projectId" value in your cypress.json configuration.'>
            <Icon icon='infoCircleOutline'/>
          </Tooltip>
        </div>
        <Cell xs={6}>
          <Table style={{marginTop:'20px'}}>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{fontWeight: '100'}}>Hooks</div>
                    <Button
                      size='small'
                      skin='ghost'
                      onClick={()=>{
                        setFormState({
                          ...formState,
                          hooks: [
                            ...formState?.hooks || [],
                            ...[{
                              hookType:hookTypes.GENERIC_HOOK
                            }]
                          ]
                        });
                      }}
                    >
                      <Icon
                        icon="plus"
                        size={1.3}
                        style={{marginRight:'5px'}}
                      />
                      <span style={{fontWeight: '100'}}>Add Hook</span>
                    </Button>
                  </div>
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {formState?.hooks?.map((hook, index)=>{
                const isNewHook = !hook.hookId;
                return (
                  <React.Fragment key={index}>
                    <TableRow onClick={()=>{
                      setFormState(state => (
                        setWith(
                          clone(state),
                          `hooks[${index}]._expanded`,
                          !hook._expanded,
                          clone
                        )
                      ));
                    }}>
                      <TableCell>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontWeight: 'bold'
                        }}>
                          {hook._expanded ? (
                            <Icon
                              icon="angleDown"
                              size={1.5}
                            />
                          ): (
                            <Icon
                              icon="angleRight"
                              size={1.5}
                            />
                          )}
                          {hook.url || 'New Hook'}
                        </div>
                      </TableCell>
                    </TableRow>
                    {
                      hook._expanded ? (
                        <TableRow>
                          <TableCell style={{padding: "20px 30px 30px 30px"}}>
                            <div style={{marginBottom: "20px"}}>
                              <Select
                                itemToString={(item)=>{
                                  return capitalize(item).replace(/_/g,' ')
                                }}
                                items={Object.keys(hookTypes)}
                                label="Hook Type"
                                name="hookType"
                                onChange={handleChange(`hooks[${index}].hookType`)}
                                value={hook.hookType}
                                clearable={false}
                              />
                            </div>
                            {
                              hook.hookType === hookTypes.GITHUB_STATUS_HOOK ? (
                                <>
                                  <div style={{
                                    marginBottom: "20px",
                                    position: "relative"
                                  }}>
                                    <TextField
                                      name='url'
                                      label='url'
                                      placeholder='Enter your github project url'
                                      value={hook.url}
                                      onChange={handleChange(`hooks[${index}].url`)}
                                      disabled={creating || updating || loading}
                                      required
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      right: '-71px',
                                      top: '29px'
                                    }}>
                                      <Tooltip text='This is the url you would use if you are looking at your github repository root in a web browser. This url will be broken up into protocol, domain, organization, and repository. When api calls are made to update pr status these are the variables that will be used.'>
                                        <Icon icon='infoCircleOutline'/>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div style={{
                                    marginBottom: "32px",
                                    position: "relative"
                                  }}>
                                    <TextField
                                      name='githubToken'
                                      label={(
                                        <span>
                                          Github Token &nbsp;
                                          <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/settings/tokens/new?scopes=repo&description=Sorry-cypress-status"
                                          >
                                            (Create One)
                                          </a>
                                        </span>
                                      )}
                                      placeholder={
                                        isNewHook ?
                                        'Enter a github token with repo:status access.' :
                                        'Using a previously saved token. You may enter a new one.'
                                      }
                                      value={hook.githubToken}
                                      onChange={handleChange(`hooks[${index}].githubToken`)}
                                      disabled={creating || updating || loading}
                                      required={isNewHook}
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      right: '-71px',
                                      top: '29px'
                                    }}>
                                      <Tooltip text='You will need to generate this token on github. Once this token is saved you will not be able to see it again. You will alwayse be able to update it.'>
                                        <Icon icon='infoCircleOutline'/>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </>
                              ) : null
                            }
                            {
                              hook.hookType === hookTypes.GENERIC_HOOK ? (
                                <>
                                  <div style={{
                                    marginBottom: "20px",
                                    position: "relative"
                                  }}>
                                    <TextField
                                      name='url'
                                      label='url'
                                      placeholder='Enter the server url for POST calls'
                                      value={hook.url}
                                      onChange={handleChange(`hooks[${index}].url`)}
                                      disabled={creating || updating || loading}
                                      required
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      right: '-71px',
                                      top: '29px'
                                    }}>
                                      <Tooltip text='This url must be resolveable from the sever where sorry-cypress running.'>
                                        <Icon icon='infoCircleOutline'/>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div style={{
                                    marginBottom: "20px",
                                    position: "relative"
                                  }}>
                                    <TextField
                                      name='headers'
                                      label='Headers (optional)'
                                      placeholder='Enter a JSON object with key values for POST call headers'
                                      value={hook.headers}
                                      onChange={handleChange(`hooks[${index}].headers`)}
                                      disabled={creating || updating || loading}
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      right: '-71px',
                                      top: '29px'
                                    }}>
                                      <Tooltip text='You can use this to pass a basic auth token or any other headers needed by your api. This must be structured as JSON. ex: {"X-api-key":"tough-key"}'>
                                        <Icon icon='infoCircleOutline'/>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div style={{
                                    marginBottom: "32px",
                                    position: "relative"
                                  }}>
                                    <Select
                                      itemIsEqual={(a,b)=>{
                                        return a === b;
                                      }}
                                      itemToString={(item)=>{
                                        return capitalize(item).replace(/_/g,' ')
                                      }}
                                      multiple={true}
                                      items={Object.keys(hookEvents)}
                                      label="Hook Events"
                                      name="hookEvents"
                                      onChange={handleChange(`hooks[${index}].hookEvents`)}
                                      value={hook.hookEvents}
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      right: '-71px',
                                      top: '29px'
                                    }}>
                                      <Tooltip text='These are the events that will trigger an xhr POST call to the provided url. Leaving this feild blank has the same effect as selecting all hook events.'>
                                        <Icon icon='infoCircleOutline'/>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </>
                              ) : null
                            }
                            <Button
                              kind='danger'
                              skin='outline'
                              onClick={()=>{
                                formState.hooks.splice(index,1);
                                setFormState({
                                  ...formState,
                                  hooks: formState.hooks
                                });
                              }}
                            >
                              Remove Hook
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) :null
                    }
                  </React.Fragment>
                );
              })}
              
            </TableBody>
          </Table>

        </Cell>
      </Grid>

      <div style={{marginTop:'32px'}}>
        <Button
          style={{marginRight:'15px'}}
          component="a"
          href="/"
          disabled={creating || updating}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          kind='primary'
          disabled={creating || updating || loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
