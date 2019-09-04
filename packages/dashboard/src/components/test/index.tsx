import React from 'react';
export function Test({ test }) {
  return (
    <div>
      <strong>[{test.state}]</strong> [{test.wallClockDuration} sec]{' '}
      {test.title.join(' > ')}
    </div>
  );
}
