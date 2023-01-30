import { Alert, AlertTitle, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import { ExpandableArea } from '@sorry-cypress/dashboard/components';
import { InstanceScreeshot } from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export const TestError = ({
  name,
  error,
  stack,
}: {
  name?: string;
  error: string;
  stack?: string | null;
}) => {
  return (
    <>
      <Alert severity="error" sx={{ overflowX: 'auto' }}>
        {name && <AlertTitle>{name}</AlertTitle>}
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.3 }}
        >
          {error}
        </Typography>
        {stack && (
          <Box mt={2}>
            <ExpandableArea label="Stack trace">
              <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap' }}>
                {stack}
              </Typography>
            </ExpandableArea>
          </Box>
        )}
      </Alert>
    </>
  );
};

export const Screenshot = ({
  screenshot,
}: {
  screenshot: Partial<InstanceScreeshot>;
}) => {
  if (!screenshot?.screenshotURL) {
    return null;
  }

  return (
    <Zoom>
      <Box
        component="img"
        src={screenshot.screenshotURL}
        sx={{
          maxWidth: '100%',
          border: '1px solid ' + grey[200],
          borderRadius: 1,
        }}
      />
    </Zoom>
  );
};
