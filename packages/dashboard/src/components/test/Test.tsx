import React from 'react';

export function Test({ test, onClick }) {
  return (
    <div onClick={() => onClick(test.testId)}>
      <strong>[{test.state}]</strong> [{test.wallClockDuration} msec]{' '}
      {test.title.join(' > ')}
    </div>
  );
}
