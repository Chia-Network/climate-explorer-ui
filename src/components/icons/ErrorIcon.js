import React from 'react';
import { withTheme } from 'styled-components';

const ErrorIcon = withTheme(({ width, height }) => {
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0644 7.31485C15.0644 7.21172 14.98 7.12735 14.8769 7.12735L13.3301 7.13438L11.0004 9.91173L8.67304 7.13673L7.12382 7.12969C7.0207 7.12969 6.93633 7.21173 6.93633 7.31719C6.93633 7.36173 6.95273 7.40391 6.98086 7.43907L10.0301 11.0719L6.98086 14.7024C6.95254 14.7367 6.93682 14.7797 6.93633 14.8242C6.93633 14.9274 7.0207 15.0117 7.12382 15.0117L8.67304 15.0047L11.0004 12.2274L13.3277 15.0024L14.8746 15.0094C14.9777 15.0094 15.0621 14.9274 15.0621 14.8219C15.0621 14.7774 15.0457 14.7352 15.0175 14.7L11.973 11.0695L15.0222 7.43673C15.0504 7.40391 15.0644 7.35938 15.0644 7.31485Z"
          fill="#F5222D"
        />
        <path
          d="M11 0.523438C5.20156 0.523438 0.5 5.225 0.5 11.0234C0.5 16.8219 5.20156 21.5234 11 21.5234C16.7984 21.5234 21.5 16.8219 21.5 11.0234C21.5 5.225 16.7984 0.523438 11 0.523438ZM11 19.7422C6.18594 19.7422 2.28125 15.8375 2.28125 11.0234C2.28125 6.20938 6.18594 2.30469 11 2.30469C15.8141 2.30469 19.7188 6.20938 19.7188 11.0234C19.7188 15.8375 15.8141 19.7422 11 19.7422Z"
          fill="#F5222D"
        />
      </svg>
    </>
  );
});

export { ErrorIcon };
