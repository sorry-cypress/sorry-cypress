import { Typography } from '@mui/material';
import React, { Fragment, FunctionComponent } from 'react';

export const CommitMessage: CommitMessageComponent = (props) => {
  const { message, brief = false } = props;

  if (!message) {
    return null;
  }

  const commitLines = message?.split(/\r?\n/);
  const [firstLine, ...otherLines] = commitLines;

  return (
    <>
      <Typography component="span" variant="subtitle1">
        {firstLine}
      </Typography>
      {!brief && (
        <Typography component="span" variant="caption">
          {otherLines.map((line, index) => {
            if (!line) {
              return (
                <Fragment key={index}>
                  <br />
                </Fragment>
              );
            }
            return <Fragment key={index}>{line}</Fragment>;
          })}
        </Typography>
      )}
    </>
  );
};

type CommitMessageProps = {
  brief?: boolean;
  message?: string | null;
};
type CommitMessageComponent = FunctionComponent<CommitMessageProps>;
