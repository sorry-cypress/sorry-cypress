import React from 'react';
export function TestDetails({ test, screenshots }) {
  const screenshot = screenshots.find(s => s.testId === test.testId);
  return (
    <div>
      <ul>
        <li>
          <strong>Title:</strong> {test.title.join(' > ')}
        </li>
        <li>
          <strong>State:</strong> {test.state}
        </li>
        <li>
          <strong>Wall clock duration:</strong> {test.wallClockDuration} msec
        </li>
        {test.error && (
          <li>
            <strong>Error message:</strong> {test.error}
          </li>
        )}
      </ul>
      {screenshot && <img src={screenshot.screenshotURL} />}
      <div></div>
    </div>
  );
}
