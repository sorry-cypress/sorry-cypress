import { PrecisionManufacturing as PrecisionManufacturingIcon } from '@mui/icons-material';
import { Grid, Link, Tooltip, Typography } from '@mui/material';
import { environment } from '@sorry-cypress/dashboard/state/environment';
import React, { FunctionComponent } from 'react';

export const CiUrl: CiUrlComponent = (props) => {
  const { ciBuildId, projectId, disableLink } = props;
  if (typeof environment.CI_URL !== 'string') {
    return null;
  }

  if (!environment.CI_URL.trim()) {
    return null;
  }

  if (!ciBuildId || !projectId) {
    return null;
  }

  const [name, url] = environment.CI_URL.split(',', 2);
  if (!name || !url) {
    return null;
  }

  const parsedUrl = url
    .replace('{project_id}', projectId)
    .replace('{build_id}', ciBuildId);
  return (
    <Grid container>
      <Grid item container alignItems="flex-start">
        <Grid item mt={0.4} mr={1}>
          <Tooltip title="CI URL">
            <PrecisionManufacturingIcon fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="CI URL (Generated from CI_URL env var)">
            <Typography component="p" variant="subtitle1">
              {!disableLink && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={parsedUrl}
                  underline="hover"
                >
                  {name}
                </Link>
              )}
              {disableLink && name}
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

type CiUrlProps = {
  ciBuildId: string | null | undefined;
  projectId: string | null | undefined;
  disableLink?: boolean;
};
type CiUrlComponent = FunctionComponent<CiUrlProps>;
