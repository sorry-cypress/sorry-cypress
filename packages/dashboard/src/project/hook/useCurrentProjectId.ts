import { useParams } from 'react-router-dom';

export const useCurrentProjectId = () => {
  const { projectId } = useParams();
  return projectId!;
};
