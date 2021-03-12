import { useRouteMatch } from 'react-router';

export const useCurrentProjectId = () => {
  const {
    params: { projectId },
  } = useRouteMatch<{ projectId: string }>();
  return projectId;
};
