import { DASHBOARD_URL } from '../config';

export const getDashboardRunURL = (runId: string): string =>
  `${DASHBOARD_URL}/runs/${runId}`;
