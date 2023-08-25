import {
  getProjectPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InsightDetails } from './insightDetails';

export const InsightsView: InsightsViewComponent = () => {
  const { projectId } = useParams();

  useLayoutEffect(() => {
    setNav([
      {
        type: NavItemType.projects,
        label: 'Projects',
        link: './projects',
      },
      {
        type: NavItemType.project,
        label: projectId,
        link: getProjectPath(projectId),
      },
      {
        type: NavItemType.insights,
        label: 'Insights',
      },
    ]);
  }, []);

  return <InsightDetails projectId={projectId!} />;
};

type InsightsViewProps = {
  // nothing
};
type InsightsViewComponent = FunctionComponent<InsightsViewProps>;
