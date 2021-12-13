import { Typography } from '@mui/material';
import { Paper } from '@sorry-cypress/dashboard/components';
import {
  getProjectPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { DeleteProject } from './deleteProject';
import { WithHooksForm } from './hook/hookFormReducer';
import { useCurrentProjectId } from './hook/useCurrentProjectId';
import { HooksEditor } from './hooksEditor';
import { ProjectEditForm } from './projectEditForm';

export function ProjectEditView() {
  const projectId = useCurrentProjectId();
  const history = useHistory();
  const isNewProject = projectId === '--create-new-project--';

  useLayoutEffect(() => {
    if (isNewProject) {
      setNav([
        {
          type: NavItemType.newProject,
          label: 'New project',
        },
      ]);
    } else {
      setNav([
        {
          label: projectId,
          type: NavItemType.project,
          link: getProjectPath(projectId),
        },
        {
          type: NavItemType.projectSettings,
          label: 'Project Settings',
        },
      ]);
    }
  }, [isNewProject]);

  function onProjectCreated({ projectId }: { projectId: string }) {
    history.push(`/${projectId}/edit`);
  }

  return (
    <>
      <WithHooksForm>
        <Typography variant="h6">Project Settings</Typography>
        <Paper>
          <ProjectEditForm
            projectId={projectId}
            isNewProject={isNewProject}
            onProjectCreated={onProjectCreated}
          />
        </Paper>
        {!isNewProject && <HooksEditor />}
        {!isNewProject && <DeleteProject />}
      </WithHooksForm>
    </>
  );
}
